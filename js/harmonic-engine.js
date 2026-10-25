/**
 * Henrysia Harmonic Engine
 * Eliminates disharmony and jarring tone clusters in visual font patterns
 * by filtering notes into beautiful, consonant chords and adding deep,
 * soothing phantom bass notes.
 *
 * Visual graphics (waterfall bars, key hits, particles) remain 100% intact,
 * while audio playback sounds like a serene ambient piano performance.
 */

class HarmonicEngine {
  constructor() {
    this.enabled = true; // active by default in 'harmonicChords' mode

    // 4-Bar Lush Chord Progression in C Major (I - V/7 - vi - IV)
    // Universal consonant progression: Cmaj9 -> G6/B -> Am9 -> Fmaj9
    this.barDurationSec = 2.0; // Each chord lasts 2.0 seconds (8.0s full progression cycle)
    this.progression = [
      {
        name: 'C Major 9',
        root: 0,
        bassPitch: 36, // C2 (deep resonant anchor)
        // Chord tones (mod 12) with priority weights (higher = stronger chord tone)
        // 0: C (root), 7: G (5th), 4: E (3rd), 2: D (9th), 9: A (6th), 11: B (maj7)
        tones: { 0: 10, 7: 9, 4: 8, 2: 6, 9: 5, 11: 4 },
        avoid: [1, 3, 5, 6, 8, 10] // F (5), F# (6), C# (1), etc. are avoided
      },
      {
        name: 'G Major 6 / B',
        root: 7,
        bassPitch: 35, // B1
        // 7: G, 2: D, 11: B, 4: E (6th), 9: A (9th)
        tones: { 7: 10, 2: 9, 11: 8, 4: 6, 9: 5 },
        avoid: [0, 1, 3, 5, 6, 8, 10]
      },
      {
        name: 'A minor 9',
        root: 9,
        bassPitch: 33, // A1
        // 9: A, 4: E, 0: C, 7: G (min7), 2: D (11th)
        tones: { 9: 10, 4: 9, 0: 8, 7: 7, 2: 5 },
        avoid: [1, 3, 5, 6, 8, 10, 11]
      },
      {
        name: 'F Major 9',
        root: 5,
        bassPitch: 41, // F2
        // 5: F, 0: C, 9: A, 4: E (maj7), 7: G (9th), 2: D (6th)
        tones: { 5: 10, 0: 9, 9: 8, 4: 6, 7: 5, 2: 4 },
        avoid: [1, 3, 6, 8, 10, 11] // B (11) is avoided (harsh tritone)
      }
    ];

    this.lastBassChordIdx = -1;
    this.lastBassTime = -1;
    this.recentStrikes = []; // Tracking simultaneous notes in ~75ms window
  }

  setEnabled(val) {
    this.enabled = !!val;
    this.recentStrikes = [];
    this.lastBassChordIdx = -1;
  }

  reset() {
    this.recentStrikes = [];
    this.lastBassChordIdx = -1;
    this.lastBassTime = -1;
  }

  getCurrentChord(currentTime) {
    const t = Math.max(0, currentTime);
    const chordIdx = Math.floor(t / this.barDurationSec) % this.progression.length;
    return { chord: this.progression[chordIdx], chordIdx, timeInBar: t % this.barDurationSec };
  }

  /**
   * Check whether a phantom bass note should be triggered for the active chord.
   * Called during audio trigger / animation frame.
   */
  checkPhantomBass(currentTime, audio) {
    if (!this.enabled || !audio) return;
    const { chord, chordIdx } = this.getCurrentChord(currentTime);

    // If we entered a new chord bar and haven't played the bass note yet
    if (chordIdx !== this.lastBassChordIdx || Math.abs(currentTime - this.lastBassTime) > this.barDurationSec * 1.5) {
      this.lastBassChordIdx = chordIdx;
      this.lastBassTime = currentTime;
      // Play warm, soothing phantom bass note
      audio.playNote(chord.bassPitch, 0.58);
    }
  }

  /**
   * Determines whether note with pitch `pitch` should sound or be muted.
   * Returns { play: boolean, velocity: number }
   */
  filterNote(pitch, velocity, currentTime, audio) {
    if (!this.enabled) {
      return { play: true, velocity };
    }

    // Trigger phantom bass if entering new bar
    this.checkPhantomBass(currentTime, audio);

    const { chord } = this.getCurrentChord(currentTime);
    const pitchClass = pitch % 12;
    const weight = chord.tones[pitchClass];

    // If not a recognized harmonic chord tone, mute it!
    if (!weight) {
      return { play: false, velocity: 0 };
    }

    // Clean up strikes older than 75ms
    const windowStart = currentTime - 0.075;
    this.recentStrikes = this.recentStrikes.filter(s => s.time >= windowStart);

    // Enforce polyphony density: max 3 notes per 75ms slice
    if (this.recentStrikes.length >= 3) {
      return { play: false, velocity: 0 };
    }

    // Check interval collisions with recent strikes
    for (const strike of this.recentStrikes) {
      const interval = Math.abs(pitch - strike.pitch);
      // Duplicate note already struck
      if (interval === 0) {
        return { play: false, velocity: 0 };
      }
      // Dissonant clash: within 1 or 2 semitones (minor or major second cluster)
      if (interval < 3) {
        // Mute to prevent dense cluster
        return { play: false, velocity: 0 };
      }
    }

    // Allowed! Record strike
    this.recentStrikes.push({
      pitch,
      time: currentTime,
      weight
    });

    // Slightly soften velocity for sweet, warm acoustic balance
    const voicedVel = Math.min(0.85, Math.max(0.45, (velocity || 0.8) * 0.88));
    return { play: true, velocity: voicedVel };
  }

  /**
   * Filters an array of notes into a beautiful harmonic arrangement with phantom bass notes.
   * Used for MIDI export or offline processing.
   */
  filterNotesArray(notes) {
    if (!notes || notes.length === 0) return notes;
    const sorted = [...notes].sort((a, b) => a.startTime - b.startTime);
    const result = [];
    let recent = [];
    let lastBassBar = -1;

    for (const note of sorted) {
      const t = note.startTime;
      const { chord, chordIdx } = this.getCurrentChord(t);

      // Add phantom bass note once per bar
      if (chordIdx !== lastBassBar) {
        lastBassBar = chordIdx;
        result.push({
          pitch: chord.bassPitch,
          startTime: t,
          duration: this.barDurationSec * 0.9,
          velocity: 0.58,
          channel: 1,
          isPhantom: true
        });
      }

      const pitchClass = note.pitch % 12;
      const weight = chord.tones[pitchClass];
      if (!weight) continue;

      const windowStart = t - 0.075;
      recent = recent.filter(s => s.time >= windowStart);
      if (recent.length >= 3) continue;

      let clash = false;
      for (const s of recent) {
        if (Math.abs(note.pitch - s.pitch) < 3) {
          clash = true;
          break;
        }
      }
      if (clash) continue;

      recent.push({ pitch: note.pitch, time: t, weight });
      result.push({
        ...note,
        velocity: Math.min(0.85, Math.max(0.45, (note.velocity || 0.8) * 0.88))
      });
    }

    return result.sort((a, b) => a.startTime - b.startTime);
  }
}

window.HarmonicEngine = new HarmonicEngine();
