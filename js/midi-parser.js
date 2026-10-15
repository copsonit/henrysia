/**
 * Pure JavaScript Standard MIDI File (SMF) Parser
 * Reads Type 0 and Type 1 .mid files into an array of timed note events.
 */

class MidiParser {
  static parse(arrayBuffer) {
    const data = new DataView(arrayBuffer);
    let offset = 0;

    function readString(length) {
      let str = '';
      for (let i = 0; i < length; i++) {
        str += String.fromCharCode(data.getUint8(offset++));
      }
      return str;
    }

    function readUint32() {
      const val = data.getUint32(offset);
      offset += 4;
      return val;
    }

    function readUint16() {
      const val = data.getUint16(offset);
      offset += 2;
      return val;
    }

    function readUint8() {
      return data.getUint8(offset++);
    }

    function readVarLen() {
      let value = 0;
      let byte = 0;
      do {
        byte = readUint8();
        value = (value << 7) | (byte & 0x7F);
      } while (byte & 0x80);
      return value;
    }

    // Header Chunk
    const headerChunkId = readString(4);
    if (headerChunkId !== 'MThd') {
      throw new Error('Not a valid MIDI file: Missing MThd header');
    }

    const headerLength = readUint32();
    const format = readUint16();
    const numTracks = readUint16();
    const division = readUint16(); // ticks per quarter note
    offset += (headerLength - 6); // skip any extra header bytes

    const rawEvents = []; // { track, tick, type, note, velocity, channel, tempo }

    // Parse Tracks
    for (let t = 0; t < numTracks; t++) {
      if (offset >= data.byteLength) break;
      const trackChunkId = readString(4);
      if (trackChunkId !== 'MTrk') {
        // Skip unknown chunk
        const chunkLen = readUint32();
        offset += chunkLen;
        continue;
      }

      const trackLength = readUint32();
      const trackEnd = offset + trackLength;
      let tick = 0;
      let runningStatus = 0;

      while (offset < trackEnd) {
        const delta = readVarLen();
        tick += delta;

        let status = readUint8();
        if (status < 0x80) {
          // Running status
          status = runningStatus;
          offset--; // re-read this byte as data byte
        } else {
          runningStatus = status;
        }

        const eventType = status >> 4;
        const channel = status & 0x0F;

        if (eventType === 0x8) {
          // Note Off
          const note = readUint8();
          const vel = readUint8();
          rawEvents.push({ track: t, tick, type: 'noteOff', note, vel, channel });
        } else if (eventType === 0x9) {
          // Note On (or note off if vel === 0)
          const note = readUint8();
          const vel = readUint8();
          if (vel === 0) {
            rawEvents.push({ track: t, tick, type: 'noteOff', note, vel: 0, channel });
          } else {
            rawEvents.push({ track: t, tick, type: 'noteOn', note, vel: vel / 127, channel });
          }
        } else if (eventType === 0xA) {
          // Polyphonic key pressure
          readUint8(); readUint8();
        } else if (eventType === 0xB) {
          // Control change
          readUint8(); readUint8();
        } else if (eventType === 0xC) {
          // Program change
          readUint8();
        } else if (eventType === 0xD) {
          // Channel pressure
          readUint8();
        } else if (eventType === 0xE) {
          // Pitch wheel change
          readUint8(); readUint8();
        } else if (status === 0xFF) {
          // Meta Event
          const metaType = readUint8();
          const metaLen = readVarLen();
          if (metaType === 0x51 && metaLen === 3) {
            // Set Tempo (microseconds per quarter note)
            const msPerBeat = (readUint8() << 16) | (readUint8() << 8) | readUint8();
            rawEvents.push({ track: t, tick, type: 'tempo', usPerBeat: msPerBeat });
          } else {
            // Skip other meta events
            offset += metaLen;
          }
        } else if (status === 0xF0 || status === 0xF7) {
          // SysEx
          const sysexLen = readVarLen();
          offset += sysexLen;
        }
      }
    }

    // Sort raw events by tick
    rawEvents.sort((a, b) => a.tick - b.tick);

    // Build Tempo Map to convert ticks to seconds
    const tempoMap = [];
    let currentUsPerBeat = 500000; // Default 120 BPM = 500,000 microseconds
    tempoMap.push({ tick: 0, usPerBeat: currentUsPerBeat, timeSec: 0 });

    let lastTick = 0;
    let lastTimeSec = 0;

    rawEvents.forEach(evt => {
      if (evt.type === 'tempo') {
        const deltaTicks = evt.tick - lastTick;
        const deltaSec = (deltaTicks / division) * (currentUsPerBeat / 1000000);
        lastTimeSec += deltaSec;
        lastTick = evt.tick;
        currentUsPerBeat = evt.usPerBeat;
        tempoMap.push({ tick: evt.tick, usPerBeat: currentUsPerBeat, timeSec: lastTimeSec });
      }
    });

    function tickToSeconds(tick) {
      let segment = tempoMap[0];
      for (let i = tempoMap.length - 1; i >= 0; i--) {
        if (tick >= tempoMap[i].tick) {
          segment = tempoMap[i];
          break;
        }
      }
      const deltaTicks = tick - segment.tick;
      return segment.timeSec + (deltaTicks / division) * (segment.usPerBeat / 1000000);
    }

    // Pair Note On with Note Off
    const activeNotes = new Map(); // key = `${channel}_${note}` -> { startTime, velocity, track }
    const parsedNotes = [];

    rawEvents.forEach(evt => {
      const key = `${evt.channel}_${evt.note}`;
      const timeSec = tickToSeconds(evt.tick);

      if (evt.type === 'noteOn') {
        if (activeNotes.has(key)) {
          // If note was already sounding, close previous
          const prev = activeNotes.get(key);
          const duration = Math.max(0.05, timeSec - prev.startTime);
          parsedNotes.push({
            pitch: evt.note,
            startTime: prev.startTime,
            duration,
            velocity: prev.velocity,
            channel: evt.channel,
            track: prev.track
          });
        }
        activeNotes.set(key, { startTime: timeSec, velocity: evt.vel, track: evt.track });
      } else if (evt.type === 'noteOff') {
        if (activeNotes.has(key)) {
          const prev = activeNotes.get(key);
          const duration = Math.max(0.05, timeSec - prev.startTime);
          parsedNotes.push({
            pitch: evt.note,
            startTime: prev.startTime,
            duration,
            velocity: prev.velocity,
            channel: evt.channel,
            track: prev.track
          });
          activeNotes.delete(key);
        }
      }
    });

    // Clean up any unclosed notes at the end
    activeNotes.forEach((prev, key) => {
      const noteNum = parseInt(key.split('_')[1], 10);
      parsedNotes.push({
        pitch: noteNum,
        startTime: prev.startTime,
        duration: 0.5,
        velocity: prev.velocity,
        channel: 0,
        track: prev.track
      });
    });

    return parsedNotes.sort((a, b) => a.startTime - b.startTime);
  }
}

window.MidiParser = MidiParser;
