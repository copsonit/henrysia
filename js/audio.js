/**
 * Henrysia Audio Engine
 * High-fidelity Web Audio API Piano Synthesizer with Convolver Reverb
 * and Soundfont/Sample support.
 */

class PianoAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.reverbNode = null;
    this.dryNode = null;
    this.wetNode = null;
    this.activeVoices = new Map(); // midiNote -> array of active nodes
    this.isMuted = false;
    this.volume = 0.85;
    this.soundMode = 'grand'; // 'grand', 'warm', 'electric', 'bright'
    this.sampleBuffers = new Map();
    this.samplesLoaded = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContext();

    // Master volume
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    // Compressor / Limiter to avoid clipping with dense chords
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
    this.compressor.knee.setValueAtTime(10, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.002, this.ctx.currentTime);
    this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

    // Reverb send/return
    this.dryNode = this.ctx.createGain();
    this.wetNode = this.ctx.createGain();
    this.dryNode.gain.setValueAtTime(0.75, this.ctx.currentTime);
    this.wetNode.gain.setValueAtTime(0.35, this.ctx.currentTime);

    this.reverbNode = this.createConvolverReverb(2.4, 1.8);

    // Routing
    this.dryNode.connect(this.compressor);
    if (this.reverbNode) {
      this.reverbNode.connect(this.wetNode);
      this.wetNode.connect(this.compressor);
    }
    this.compressor.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  ensureContext() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.02);
    }
  }

  setSoundMode(mode) {
    this.soundMode = mode;
  }

  /**
   * Generates a lush acoustic concert hall impulse response for natural piano resonance.
   */
  createConvolverReverb(duration = 2.2, decay = 2.0) {
    if (!this.ctx) return null;
    const rate = this.ctx.sampleRate;
    const length = rate * duration;
    const impulse = this.ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const t = i / rate;
      const n = (Math.random() * 2 - 1);
      const envelope = Math.pow(1 - i / length, decay);
      left[i] = n * envelope;
      right[i] = (Math.random() * 2 - 1) * envelope;
    }

    const convolver = this.ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  /**
   * Convert MIDI note number to frequency in Hz (A4 = 69 = 440Hz)
   */
  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  /**
   * Play note with realistic acoustic piano modeling
   */
  playNote(midiNote, velocity = 0.8) {
    this.ensureContext();
    if (!this.ctx) return;

    // Cut previous instance of same note if hanging
    this.stopNote(midiNote, 0.05);

    const now = this.ctx.currentTime;
    const freq = this.midiToFreq(midiNote);
    const vel = Math.max(0.1, Math.min(1.0, velocity));

    // Voice container
    const voiceGain = this.ctx.createGain();
    voiceGain.connect(this.dryNode);
    if (this.reverbNode) {
      voiceGain.connect(this.reverbNode);
    }

    const oscillators = [];

    // Acoustic Piano Harmonic Profiles based on mode
    let partials;
    if (this.soundMode === 'warm') {
      partials = [
        { mult: 1, gain: 1.0, decay: 3.2 },
        { mult: 2, gain: 0.35, decay: 2.4 },
        { mult: 3, gain: 0.12, decay: 1.8 },
        { mult: 4, gain: 0.05, decay: 1.2 }
      ];
    } else if (this.soundMode === 'electric') {
      partials = [
        { mult: 1, gain: 0.8, decay: 3.0, type: 'sine' },
        { mult: 2, gain: 0.6, decay: 2.2, type: 'triangle' },
        { mult: 3, gain: 0.25, decay: 1.5, type: 'sine' },
        { mult: 7, gain: 0.15, decay: 0.8, type: 'sine' }
      ];
    } else if (this.soundMode === 'bright') {
      partials = [
        { mult: 1, gain: 1.0, decay: 2.8 },
        { mult: 2, gain: 0.55, decay: 2.3 },
        { mult: 3, gain: 0.35, decay: 1.8 },
        { mult: 4, gain: 0.2, decay: 1.4 },
        { mult: 5, gain: 0.15, decay: 1.1 },
        { mult: 6, gain: 0.08, decay: 0.8 }
      ];
    } else {
      // 'grand' acoustic grand piano
      // Inharmonicity factor for realistic acoustic piano strings
      const B = 0.00015 * Math.pow(freq / 261.6, 0.6);
      partials = [
        { mult: 1 * Math.sqrt(1 + B * 1), gain: 1.0, decay: 3.2 },
        { mult: 2 * Math.sqrt(1 + B * 4), gain: 0.45, decay: 2.5 },
        { mult: 3 * Math.sqrt(1 + B * 9), gain: 0.25, decay: 1.9 },
        { mult: 4 * Math.sqrt(1 + B * 16), gain: 0.12, decay: 1.4 },
        { mult: 5 * Math.sqrt(1 + B * 25), gain: 0.08, decay: 1.0 },
        { mult: 6 * Math.sqrt(1 + B * 36), gain: 0.04, decay: 0.7 }
      ];
    }

    // Lower notes ring out longer; higher notes decay faster
    const registerDecayFactor = Math.pow(261.6 / Math.max(80, freq), 0.35);

    partials.forEach((p, idx) => {
      const osc = this.ctx.createOscillator();
      const pGain = this.ctx.createGain();

      osc.type = p.type || (idx === 0 ? 'sine' : (idx === 1 ? 'triangle' : 'sine'));
      
      // Slight detune for physical string chorus (piano 3-string unisons)
      const detuneCents = (idx === 0 ? (Math.random() * 2 - 1) * 1.5 : (Math.random() * 4 - 2) * 2.5);
      osc.frequency.setValueAtTime(freq * p.mult, now);
      osc.detune.setValueAtTime(detuneCents, now);

      const targetGain = p.gain * vel * 0.4;
      const decayTime = p.decay * registerDecayFactor;

      // Percussive strike attack (hammer hitting string)
      pGain.gain.setValueAtTime(0.0001, now);
      pGain.gain.linearRampToValueAtTime(targetGain, now + 0.003); // 3ms attack
      // Exponential decay to sustain
      pGain.gain.exponentialRampToValueAtTime(targetGain * 0.4, now + 0.15);
      pGain.gain.exponentialRampToValueAtTime(0.0001, now + decayTime);

      osc.connect(pGain);
      pGain.connect(voiceGain);

      osc.start(now);
      osc.stop(now + decayTime + 0.1);
      oscillators.push(osc);
    });

    // Acoustic hammer knock / transient noise click
    try {
      const hammerBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.02), this.ctx.sampleRate);
      const hammerData = hammerBuffer.getChannelData(0);
      for (let i = 0; i < hammerData.length; i++) {
        hammerData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (hammerData.length * 0.3));
      }
      const hammerSource = this.ctx.createBufferSource();
      hammerSource.buffer = hammerBuffer;

      const hammerFilter = this.ctx.createBiquadFilter();
      hammerFilter.type = 'bandpass';
      hammerFilter.frequency.setValueAtTime(Math.min(2500, freq * 2.5 + 400), now);
      hammerFilter.Q.setValueAtTime(2.0, now);

      const hammerGain = this.ctx.createGain();
      hammerGain.gain.setValueAtTime(0.15 * vel, now);
      hammerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

      hammerSource.connect(hammerFilter);
      hammerFilter.connect(hammerGain);
      hammerGain.connect(voiceGain);

      hammerSource.start(now);
    } catch (e) {
      // Non-fatal if noise buffer fails
    }

    // Save active voice references
    if (!this.activeVoices.has(midiNote)) {
      this.activeVoices.set(midiNote, []);
    }
    this.activeVoices.get(midiNote).push({
      voiceGain,
      oscillators,
      startTime: now
    });
  }

  /**
   * Release / stop note (damper fell back on string)
   */
  stopNote(midiNote, releaseTime = 0.25) {
    if (!this.ctx || !this.activeVoices.has(midiNote)) return;
    const voices = this.activeVoices.get(midiNote);
    const now = this.ctx.currentTime;

    voices.forEach(voice => {
      try {
        voice.voiceGain.gain.cancelScheduledValues(now);
        voice.voiceGain.gain.setValueAtTime(voice.voiceGain.gain.value, now);
        voice.voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + releaseTime);
        setTimeout(() => {
          voice.oscillators.forEach(osc => {
            try { osc.stop(); } catch (e) {}
          });
        }, releaseTime * 1000 + 50);
      } catch (e) {}
    });

    this.activeVoices.delete(midiNote);
  }

  /**
   * Stop all active notes immediately
   */
  stopAll() {
    if (!this.ctx) return;
    for (const midiNote of this.activeVoices.keys()) {
      this.stopNote(midiNote, 0.05);
    }
    this.activeVoices.clear();
  }
}

// Global audio singleton
window.PianoAudio = new PianoAudioEngine();
