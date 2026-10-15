/**
 * Henrysia Song & Pattern Library
 * Built-in songs, educational patterns, and visual animations.
 */

class SongLibrary {
  static getSongs() {
    return [
      {
        id: 'henry_name',
        title: "🌟 Henry's Grand Showcase",
        category: 'Henry Special',
        description: 'Spells H-E-N-R-Y in giant glowing notes across the piano with celestial chimes!',
        getNotes: () => {
          // Banner of H E N R Y across the keyboard + triumphant celebration
          const bannerNotes = PatternGenerator.generateTextNotes("HENRY", {
            mode: 'banner',
            scale: 'pentatonic',
            rowDurationSec: 0.22
          });

          // Follow with celebratory fanfare
          const fanfareStart = 2.4;
          const fanfare = [
            // Melody & Chords
            { pitch: 60, startTime: fanfareStart + 0.0, duration: 0.35, velocity: 0.9, channel: 0 },
            { pitch: 64, startTime: fanfareStart + 0.0, duration: 0.35, velocity: 0.8, channel: 1 },
            { pitch: 48, startTime: fanfareStart + 0.0, duration: 0.8, velocity: 0.85, channel: 1 },

            { pitch: 64, startTime: fanfareStart + 0.4, duration: 0.35, velocity: 0.9, channel: 0 },
            { pitch: 67, startTime: fanfareStart + 0.4, duration: 0.35, velocity: 0.8, channel: 1 },

            { pitch: 67, startTime: fanfareStart + 0.8, duration: 0.4, velocity: 0.95, channel: 0 },
            { pitch: 72, startTime: fanfareStart + 0.8, duration: 0.4, velocity: 0.9, channel: 0 },
            { pitch: 55, startTime: fanfareStart + 0.8, duration: 0.8, velocity: 0.85, channel: 1 },

            // Big ending C major chord
            { pitch: 48, startTime: fanfareStart + 1.4, duration: 1.8, velocity: 0.95, channel: 1 },
            { pitch: 55, startTime: fanfareStart + 1.4, duration: 1.8, velocity: 0.9, channel: 1 },
            { pitch: 60, startTime: fanfareStart + 1.4, duration: 1.8, velocity: 0.95, channel: 0 },
            { pitch: 64, startTime: fanfareStart + 1.4, duration: 1.8, velocity: 0.95, channel: 0 },
            { pitch: 67, startTime: fanfareStart + 1.4, duration: 1.8, velocity: 0.95, channel: 0 },
            { pitch: 72, startTime: fanfareStart + 1.4, duration: 1.8, velocity: 1.0, channel: 0 },
            { pitch: 84, startTime: fanfareStart + 1.4, duration: 1.8, velocity: 0.95, channel: 0 }
          ];

          return [...bannerNotes, ...fanfare];
        }
      },
      {
        id: 'counting_10',
        title: "🔢 Counting Numbers 1 to 10",
        category: 'Learning & Fun',
        description: 'Giant glowing numbers 1 through 10 scrolling down with rising musical pitches!',
        getNotes: () => PatternGenerator.generateCountingNumbers(10)
      },
      {
        id: 'alphabet_song',
        title: "🔤 Alphabet Waterfall (A to Z)",
        category: 'Learning & Fun',
        description: 'Sequential letters of the alphabet scrolling down with joyful musical notes!',
        getNotes: () => {
          return PatternGenerator.generateTextNotes("ABCDEFG HIJKLMN OPQRSTU VWXYZ", {
            mode: 'sequential',
            scale: 'major',
            charSpacingSec: 1.4,
            rowDurationSec: 0.14
          });
        }
      },
      {
        id: 'shapes_parade',
        title: "💖 Shapes & Emoji Parade",
        category: 'Learning & Fun',
        description: 'Cascading hearts, smiley faces, and stars falling into the piano keys!',
        getNotes: () => PatternGenerator.generateShapeParade(['HEART', 'SMILEY', 'STAR', 'NOTE', 'HEART', 'STAR'])
      },
      {
        id: 'rainbow_cascade',
        title: "🌈 Rainbow Waterfall & Staircases",
        category: 'Visual Piano Art',
        description: 'Symmetrical geometric pyramid waterfalls and scale ripples across all 88 keys.',
        getNotes: () => {
          const notes = [];
          // Ascending staircase
          let t = 0.5;
          for (let p = 36; p <= 84; p++) {
            notes.push({ pitch: p, startTime: t, duration: 0.25, velocity: 0.85, channel: 0 });
            t += 0.08;
          }
          t += 0.4;
          // Descending staircase
          for (let p = 84; p >= 36; p--) {
            notes.push({ pitch: p, startTime: t, duration: 0.25, velocity: 0.85, channel: 1 });
            t += 0.08;
          }
          t += 0.4;
          // Pyramid expanding outward from center (C4 = 60)
          for (let step = 0; step < 24; step++) {
            notes.push({ pitch: 60 - step, startTime: t, duration: 0.35, velocity: 0.9, channel: 1 });
            notes.push({ pitch: 60 + step, startTime: t, duration: 0.35, velocity: 0.9, channel: 0 });
            t += 0.12;
          }
          return notes;
        }
      },
      {
        id: 'twinkle_star',
        title: "⭐ Twinkle Twinkle Little Star",
        category: 'Classic Songs',
        description: 'Complete two-hand arrangement with right hand melody and left hand bass accompaniment.',
        getNotes: () => {
          const melody = [
            // Line 1: Twinkle twinkle little star (C C G G A A G)
            { p: 60, d: 1 }, { p: 60, d: 1 }, { p: 67, d: 1 }, { p: 67, d: 1 },
            { p: 69, d: 1 }, { p: 69, d: 1 }, { p: 67, d: 2 },
            // Line 2: How I wonder what you are (F F E E D D C)
            { p: 65, d: 1 }, { p: 65, d: 1 }, { p: 64, d: 1 }, { p: 64, d: 1 },
            { p: 62, d: 1 }, { p: 62, d: 1 }, { p: 60, d: 2 },
            // Line 3: Up above the world so high (G G F F E E D)
            { p: 67, d: 1 }, { p: 67, d: 1 }, { p: 65, d: 1 }, { p: 65, d: 1 },
            { p: 64, d: 1 }, { p: 64, d: 1 }, { p: 62, d: 2 },
            // Line 4: Like a diamond in the sky (G G F F E E D)
            { p: 67, d: 1 }, { p: 67, d: 1 }, { p: 65, d: 1 }, { p: 65, d: 1 },
            { p: 64, d: 1 }, { p: 64, d: 1 }, { p: 62, d: 2 },
            // Line 5: Twinkle twinkle little star (C C G G A A G)
            { p: 60, d: 1 }, { p: 60, d: 1 }, { p: 67, d: 1 }, { p: 67, d: 1 },
            { p: 69, d: 1 }, { p: 69, d: 1 }, { p: 67, d: 2 },
            // Line 6: How I wonder what you are (F F E E D D C)
            { p: 65, d: 1 }, { p: 65, d: 1 }, { p: 64, d: 1 }, { p: 64, d: 1 },
            { p: 62, d: 1 }, { p: 62, d: 1 }, { p: 60, d: 2 }
          ];

          const bass = [
            // C chord (C3 + G3)
            { p: 48, t: 0, d: 4 }, { p: 55, t: 0, d: 4 },
            // F chord -> C chord
            { p: 53, t: 4, d: 2 }, { p: 48, t: 6, d: 2 },
            // F -> C -> G -> C
            { p: 53, t: 8, d: 2 }, { p: 48, t: 10, d: 2 }, { p: 43, t: 12, d: 2 }, { p: 48, t: 14, d: 2 },
            // Middle section: C -> F -> C -> G
            { p: 48, t: 16, d: 2 }, { p: 53, t: 18, d: 2 }, { p: 48, t: 20, d: 2 }, { p: 43, t: 22, d: 2 },
            { p: 48, t: 24, d: 2 }, { p: 53, t: 26, d: 2 }, { p: 48, t: 28, d: 2 }, { p: 43, t: 30, d: 2 },
            // Ending section
            { p: 48, t: 32, d: 4 }, { p: 55, t: 32, d: 4 },
            { p: 53, t: 36, d: 2 }, { p: 48, t: 38, d: 2 },
            { p: 53, t: 40, d: 2 }, { p: 48, t: 42, d: 2 }, { p: 43, t: 44, d: 2 }, { p: 48, t: 46, d: 2 }
          ];

          const beat = 0.55;
          const notes = [];
          let currentBeat = 0;

          melody.forEach(m => {
            notes.push({
              pitch: m.p,
              startTime: 0.5 + currentBeat * beat,
              duration: m.d * beat * 0.9,
              velocity: 0.88,
              channel: 0
            });
            currentBeat += m.d;
          });

          bass.forEach(b => {
            notes.push({
              pitch: b.p,
              startTime: 0.5 + b.t * beat,
              duration: b.d * beat * 0.9,
              velocity: 0.72,
              channel: 1
            });
          });

          return notes;
        }
      },
      {
        id: 'happy_birthday',
        title: '🎂 Happy Birthday to Henry',
        category: 'Classic Songs',
        description: 'Joyful birthday celebration with accompaniment.',
        getNotes: () => {
          const beat = 0.5;
          const melody = [
            { p: 60, d: 0.75 }, { p: 60, d: 0.25 }, { p: 62, d: 1 }, { p: 60, d: 1 }, { p: 65, d: 1 }, { p: 64, d: 2 },
            { p: 60, d: 0.75 }, { p: 60, d: 0.25 }, { p: 62, d: 1 }, { p: 60, d: 1 }, { p: 67, d: 1 }, { p: 65, d: 2 },
            { p: 60, d: 0.75 }, { p: 60, d: 0.25 }, { p: 72, d: 1 }, { p: 69, d: 1 }, { p: 65, d: 1 }, { p: 64, d: 1 }, { p: 62, d: 1 },
            { p: 70, d: 0.75 }, { p: 70, d: 0.25 }, { p: 69, d: 1 }, { p: 65, d: 1 }, { p: 67, d: 1 }, { p: 65, d: 2.5 }
          ];

          const bass = [
            { p: 48, t: 0, d: 3 }, { p: 55, t: 3, d: 3 },
            { p: 55, t: 6, d: 3 }, { p: 48, t: 9, d: 3 },
            { p: 48, t: 12, d: 3 }, { p: 41, t: 15, d: 3 },
            { p: 48, t: 18, d: 1.5 }, { p: 55, t: 19.5, d: 1.5 }, { p: 48, t: 21, d: 3 }
          ];

          const notes = [];
          let currentBeat = 0;
          melody.forEach(m => {
            notes.push({
              pitch: m.p,
              startTime: 0.5 + currentBeat * beat,
              duration: m.d * beat * 0.9,
              velocity: 0.9,
              channel: 0
            });
            currentBeat += m.d;
          });

          bass.forEach(b => {
            notes.push({
              pitch: b.p,
              startTime: 0.5 + b.t * beat,
              duration: b.d * beat * 0.9,
              velocity: 0.75,
              channel: 1
            });
          });

          return notes;
        }
      },
      {
        id: 'ode_to_joy',
        title: '🎶 Ode to Joy (Beethoven)',
        category: 'Classic Songs',
        description: "Beethoven's stirring masterpiece in full glory.",
        getNotes: () => {
          const beat = 0.45;
          const melody = [
            { p: 64, d: 1 }, { p: 64, d: 1 }, { p: 65, d: 1 }, { p: 67, d: 1 },
            { p: 67, d: 1 }, { p: 65, d: 1 }, { p: 64, d: 1 }, { p: 62, d: 1 },
            { p: 60, d: 1 }, { p: 60, d: 1 }, { p: 62, d: 1 }, { p: 64, d: 1 },
            { p: 64, d: 1.5 }, { p: 62, d: 0.5 }, { p: 62, d: 2 },

            { p: 64, d: 1 }, { p: 64, d: 1 }, { p: 65, d: 1 }, { p: 67, d: 1 },
            { p: 67, d: 1 }, { p: 65, d: 1 }, { p: 64, d: 1 }, { p: 62, d: 1 },
            { p: 60, d: 1 }, { p: 60, d: 1 }, { p: 62, d: 1 }, { p: 64, d: 1 },
            { p: 62, d: 1.5 }, { p: 60, d: 0.5 }, { p: 60, d: 2 }
          ];

          const bass = [
            { p: 48, t: 0, d: 4 }, { p: 55, t: 4, d: 4 }, { p: 48, t: 8, d: 4 }, { p: 55, t: 12, d: 4 },
            { p: 48, t: 16, d: 4 }, { p: 55, t: 20, d: 4 }, { p: 48, t: 24, d: 4 }, { p: 48, t: 28, d: 4 }
          ];

          const notes = [];
          let cur = 0;
          melody.forEach(m => {
            notes.push({
              pitch: m.p,
              startTime: 0.5 + cur * beat,
              duration: m.d * beat * 0.92,
              velocity: 0.88,
              channel: 0
            });
            cur += m.d;
          });

          bass.forEach(b => {
            notes.push({
              pitch: b.p,
              startTime: 0.5 + b.t * beat,
              duration: b.d * beat * 0.92,
              velocity: 0.72,
              channel: 1
            });
          });

          return notes;
        }
      },
      {
        id: 'fuer_elise',
        title: '🎹 Für Elise (Beethoven)',
        category: 'Classic Songs',
        description: 'The famous haunting melody with cascading arpeggios.',
        getNotes: () => {
          const beat = 0.28;
          const melody = [
            { p: 76, d: 1 }, { p: 75, d: 1 }, { p: 76, d: 1 }, { p: 75, d: 1 }, { p: 76, d: 1 },
            { p: 71, d: 1 }, { p: 74, d: 1 }, { p: 72, d: 1 }, { p: 69, d: 2.5 },
            // Bass: A minor
            { p: 60, d: 1 }, { p: 64, d: 1 }, { p: 69, d: 1 }, { p: 71, d: 2.5 },
            // Bass: E major
            { p: 60, d: 1 }, { p: 68, d: 1 }, { p: 71, d: 1 }, { p: 72, d: 2.5 },
            // Repeat theme
            { p: 76, d: 1 }, { p: 75, d: 1 }, { p: 76, d: 1 }, { p: 75, d: 1 }, { p: 76, d: 1 },
            { p: 71, d: 1 }, { p: 74, d: 1 }, { p: 72, d: 1 }, { p: 69, d: 3 }
          ];

          const bass = [
            { p: 45, t: 8, d: 2.5 }, { p: 52, t: 8.8, d: 2 },
            { p: 40, t: 13, d: 2.5 }, { p: 47, t: 13.8, d: 2 },
            { p: 45, t: 18, d: 2.5 }, { p: 52, t: 18.8, d: 2 },
            { p: 45, t: 28, d: 3 }, { p: 52, t: 28.8, d: 2.5 }
          ];

          const notes = [];
          let cur = 0;
          melody.forEach(m => {
            notes.push({
              pitch: m.p,
              startTime: 0.5 + cur * beat,
              duration: m.d * beat * 0.9,
              velocity: 0.85,
              channel: 0
            });
            cur += m.d;
          });

          bass.forEach(b => {
            notes.push({
              pitch: b.p,
              startTime: 0.5 + b.t * beat,
              duration: b.d * beat * 0.9,
              velocity: 0.75,
              channel: 1
            });
          });

          return notes;
        }
      }
    ];
  }
}

window.SongLibrary = SongLibrary;
