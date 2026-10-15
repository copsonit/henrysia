/**
 * Pure JavaScript Standard MIDI File (SMF Format 0) Writer
 * Converts an array of timed notes into a valid .mid file binary blob.
 */

class MidiWriter {
  /**
   * Encodes an integer as a variable length quantity byte array
   */
  static encodeVarLen(value) {
    const bytes = [];
    bytes.push(value & 0x7F);
    value >>= 7;

    while (value > 0) {
      bytes.unshift((value & 0x7F) | 0x80);
      value >>= 7;
    }
    return bytes;
  }

  /**
   * Generates a standard MIDI file (Format 0) ArrayBuffer from notes
   * notes: array of { pitch, startTime, duration, velocity, channel }
   */
  static buildMidi(notes, options = {}) {
    const bpm = options.bpm || 120;
    const ticksPerBeat = options.ticksPerBeat || 480;
    const usPerBeat = Math.round(60000000 / bpm);

    // Convert seconds to ticks: ticks = seconds * (bpm / 60) * ticksPerBeat
    const secToTicks = (sec) => Math.round(sec * (bpm / 60) * ticksPerBeat);

    // Create events: noteOn and noteOff
    const rawEvents = [];

    // Add Tempo Meta Event at tick 0
    rawEvents.push({
      tick: 0,
      type: 'tempo',
      data: [0xFF, 0x51, 0x03, (usPerBeat >> 16) & 0xFF, (usPerBeat >> 8) & 0xFF, usPerBeat & 0xFF]
    });

    // Add Track Name Meta Event
    const trackName = options.name || 'Henrysia Pattern';
    const nameBytes = [];
    for (let i = 0; i < trackName.length; i++) {
      nameBytes.push(trackName.charCodeAt(i));
    }
    rawEvents.push({
      tick: 0,
      type: 'meta',
      data: [0xFF, 0x03, nameBytes.length, ...nameBytes]
    });

    notes.forEach(note => {
      const startTick = secToTicks(note.startTime);
      const endTick = secToTicks(note.startTime + note.duration);
      const ch = (note.channel || 0) & 0x0F;
      const vel = Math.min(127, Math.max(1, Math.round((note.velocity || 0.8) * 127)));

      rawEvents.push({
        tick: startTick,
        type: 'noteOn',
        priority: 2,
        data: [0x90 | ch, note.pitch & 0x7F, vel]
      });

      rawEvents.push({
        tick: endTick,
        type: 'noteOff',
        priority: 1, // Note offs slightly earlier than note on if same tick
        data: [0x80 | ch, note.pitch & 0x7F, 0]
      });
    });

    // Sort events by tick (and priority)
    rawEvents.sort((a, b) => {
      if (a.tick !== b.tick) return a.tick - b.tick;
      return (a.priority || 0) - (b.priority || 0);
    });

    // Build Track Data with Delta-Times
    const trackBytes = [];
    let lastTick = 0;

    rawEvents.forEach(evt => {
      const delta = evt.tick - lastTick;
      lastTick = evt.tick;
      const varLen = MidiWriter.encodeVarLen(delta);
      trackBytes.push(...varLen);
      trackBytes.push(...evt.data);
    });

    // End of Track Meta Event
    trackBytes.push(0x00, 0xFF, 0x2F, 0x00);

    // Build Header Chunk (14 bytes)
    // 'MThd' (4 bytes), length (4 bytes: 6), format 0 (2 bytes: 0), 1 track (2 bytes: 1), division (2 bytes: ticksPerBeat)
    const headerBytes = [
      0x4D, 0x54, 0x68, 0x64, // 'MThd'
      0x00, 0x00, 0x00, 0x06, // length 6
      0x00, 0x00,             // format 0
      0x00, 0x01,             // 1 track
      (ticksPerBeat >> 8) & 0xFF, ticksPerBeat & 0xFF
    ];

    // Build Track Chunk Header
    // 'MTrk' (4 bytes), track length (4 bytes)
    const trackLen = trackBytes.length;
    const trackHeaderBytes = [
      0x4D, 0x54, 0x72, 0x6B, // 'MTrk'
      (trackLen >> 24) & 0xFF,
      (trackLen >> 16) & 0xFF,
      (trackLen >> 8) & 0xFF,
      trackLen & 0xFF
    ];

    const totalLength = headerBytes.length + trackHeaderBytes.length + trackBytes.length;
    const buffer = new Uint8Array(totalLength);
    buffer.set(headerBytes, 0);
    buffer.set(trackHeaderBytes, headerBytes.length);
    buffer.set(trackBytes, headerBytes.length + trackHeaderBytes.length);

    return buffer;
  }

  /**
   * Helper to download notes as a .mid file in browser
   */
  static downloadMidi(notes, filename = 'henrysia_song.mid', options = {}) {
    const buffer = MidiWriter.buildMidi(notes, options);
    const blob = new Blob([buffer], { type: 'audio/midi' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

window.MidiWriter = MidiWriter;
