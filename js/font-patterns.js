/**
 * Henrysia Pattern & Font Engine
 * Translates letters, numbers, and pixel-art shapes into visual piano waterfall notes
 * with musical scale harmonization so patterns sound delightful to Henry.
 */

// 5x7 Dot Matrix Font for A-Z, 0-9, and Special Symbols
const FONT_5X7 = {
  // Letters
  'A': [
    " 111 ",
    "1   1",
    "1   1",
    "11111",
    "1   1",
    "1   1",
    "1   1"
  ],
  'B': [
    "1111 ",
    "1   1",
    "1   1",
    "1111 ",
    "1   1",
    "1   1",
    "1111 "
  ],
  'C': [
    " 1111",
    "1    ",
    "1    ",
    "1    ",
    "1    ",
    "1    ",
    " 1111"
  ],
  'D': [
    "1111 ",
    "1   1",
    "1   1",
    "1   1",
    "1   1",
    "1   1",
    "1111 "
  ],
  'E': [
    "11111",
    "1    ",
    "1    ",
    "1111 ",
    "1    ",
    "1    ",
    "11111"
  ],
  'F': [
    "11111",
    "1    ",
    "1    ",
    "1111 ",
    "1    ",
    "1    ",
    "1    "
  ],
  'G': [
    " 1111",
    "1    ",
    "1    ",
    "1 111",
    "1   1",
    "1   1",
    " 1111"
  ],
  'H': [
    "1   1",
    "1   1",
    "1   1",
    "11111",
    "1   1",
    "1   1",
    "1   1"
  ],
  'I': [
    "11111",
    "  1  ",
    "  1  ",
    "  1  ",
    "  1  ",
    "  1  ",
    "11111"
  ],
  'J': [
    "  111",
    "    1",
    "    1",
    "    1",
    "1   1",
    "1   1",
    " 111 "
  ],
  'K': [
    "1   1",
    "1  1 ",
    "1 1  ",
    "11   ",
    "1 1  ",
    "1  1 ",
    "1   1"
  ],
  'L': [
    "1    ",
    "1    ",
    "1    ",
    "1    ",
    "1    ",
    "1    ",
    "11111"
  ],
  'M': [
    "1   1",
    "11 11",
    "1 1 1",
    "1 1 1",
    "1   1",
    "1   1",
    "1   1"
  ],
  'N': [
    "1   1",
    "11  1",
    "1 1 1",
    "1  11",
    "1   1",
    "1   1",
    "1   1"
  ],
  'O': [
    " 111 ",
    "1   1",
    "1   1",
    "1   1",
    "1   1",
    "1   1",
    " 111 "
  ],
  'P': [
    "1111 ",
    "1   1",
    "1   1",
    "1111 ",
    "1    ",
    "1    ",
    "1    "
  ],
  'Q': [
    " 111 ",
    "1   1",
    "1   1",
    "1   1",
    "1 1 1",
    "1  1 ",
    " 11 1"
  ],
  'R': [
    "1111 ",
    "1   1",
    "1   1",
    "1111 ",
    "1  1 ",
    "1   1",
    "1   1"
  ],
  'S': [
    " 1111",
    "1    ",
    "1    ",
    " 111 ",
    "    1",
    "    1",
    "1111 "
  ],
  'T': [
    "11111",
    "  1  ",
    "  1  ",
    "  1  ",
    "  1  ",
    "  1  ",
    "  1  "
  ],
  'U': [
    "1   1",
    "1   1",
    "1   1",
    "1   1",
    "1   1",
    "1   1",
    " 111 "
  ],
  'V': [
    "1   1",
    "1   1",
    "1   1",
    "1   1",
    " 1 1 ",
    " 1 1 ",
    "  1  "
  ],
  'W': [
    "1   1",
    "1   1",
    "1   1",
    "1 1 1",
    "1 1 1",
    "11 11",
    "1   1"
  ],
  'X': [
    "1   1",
    "1   1",
    " 1 1 ",
    "  1  ",
    " 1 1 ",
    "1   1",
    "1   1"
  ],
  'Y': [
    "1   1",
    "1   1",
    " 1 1 ",
    "  1  ",
    "  1  ",
    "  1  ",
    "  1  "
  ],
  'Z': [
    "11111",
    "    1",
    "   1 ",
    "  1  ",
    " 1   ",
    "1    ",
    "11111"
  ],
  // Numbers
  '0': [
    " 111 ",
    "1  11",
    "1 1 1",
    "1 1 1",
    "11  1",
    "1   1",
    " 111 "
  ],
  '1': [
    "  1  ",
    " 11  ",
    "  1  ",
    "  1  ",
    "  1  ",
    "  1  ",
    "11111"
  ],
  '2': [
    " 111 ",
    "1   1",
    "    1",
    "  11 ",
    " 1   ",
    "1    ",
    "11111"
  ],
  '3': [
    "1111 ",
    "    1",
    "    1",
    "  11 ",
    "    1",
    "    1",
    "1111 "
  ],
  '4': [
    "1   1",
    "1   1",
    "1   1",
    "11111",
    "    1",
    "    1",
    "    1"
  ],
  '5': [
    "11111",
    "1    ",
    "1    ",
    "1111 ",
    "    1",
    "    1",
    "1111 "
  ],
  '6': [
    " 111 ",
    "1    ",
    "1    ",
    "1111 ",
    "1   1",
    "1   1",
    " 111 "
  ],
  '7': [
    "11111",
    "    1",
    "   1 ",
    "  1  ",
    " 1   ",
    " 1   ",
    " 1   "
  ],
  '8': [
    " 111 ",
    "1   1",
    "1   1",
    " 111 ",
    "1   1",
    "1   1",
    " 111 "
  ],
  '9': [
    " 111 ",
    "1   1",
    "1   1",
    " 1111",
    "    1",
    "    1",
    " 111 "
  ],
  ' ': [
    "     ",
    "     ",
    "     ",
    "     ",
    "     ",
    "     ",
    "     "
  ],
  '!': [
    "  1  ",
    "  1  ",
    "  1  ",
    "  1  ",
    "  1  ",
    "     ",
    "  1  "
  ],
  '?': [
    " 111 ",
    "1   1",
    "    1",
    "  11 ",
    "  1  ",
    "     ",
    "  1  "
  ],
  // Fun Shapes
  'HEART': [
    " 1 1 ",
    "11111",
    "11111",
    "11111",
    " 111 ",
    "  1  ",
    "     "
  ],
  'SMILEY': [
    " 111 ",
    "1   1",
    "1 1 1",
    "1   1",
    "1 1 1",
    "1  11",
    " 111 "
  ],
  'STAR': [
    "  1  ",
    " 111 ",
    "11111",
    " 111 ",
    " 1 1 ",
    "1   1",
    "     "
  ],
  'NOTE': [
    "   11",
    "   11",
    "   1 ",
    "   1 ",
    " 111 ",
    "1111 ",
    " 11  "
  ]
};

// Scale mappings: ensures that rows of pixels sound harmonic rather than dissonant
const SCALES = {
  // C Pentatonic Major: 15 notes across 3 octaves (C3, D3, E3, G3, A3, C4, D4, E4, G4, A4, C5, D5, E5, G5, A5)
  pentatonic: [48, 50, 52, 55, 57, 60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84, 86, 88, 91, 93],
  // C Major: (C3, D3, E3, F3, G3, A3, B3, C4...)
  major: [48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84],
  // Celestial Chimes (Arpeggiated chords: C, E, G, B, D, G, B)
  chime: [48, 52, 55, 59, 62, 64, 67, 71, 74, 76, 79, 83, 86, 88, 91, 95]
};

class PatternGenerator {
  /**
   * Converts any text string into falling visual piano waterfall notes.
   * Mode: 'banner' (all letters across keyboard) or 'sequential' (one letter at a time)
   */
  static generateTextNotes(text, options = {}) {
    const mode = options.mode || 'banner'; // 'banner' or 'sequential'
    const scaleName = options.scale || 'pentatonic';
    const scale = SCALES[scaleName] || SCALES.pentatonic;
    const charSpacingSec = options.charSpacingSec || 1.8;
    const rowDurationSec = options.rowDurationSec || 0.18;
    const notes = [];

    const chars = text.toUpperCase().split('');
    if (chars.length === 0) return notes;

    if (mode === 'banner') {
      // Fit letters side by side across the keyboard
      const totalLetterWidth = 6; // 5 columns + 1 blank column
      const totalColumnsNeeded = chars.length * totalLetterWidth;

      // Find center start index in scale
      const centerScaleIdx = Math.floor(scale.length / 2);
      const startScaleIdx = Math.max(0, centerScaleIdx - Math.floor(totalColumnsNeeded / 2));

      chars.forEach((ch, charIdx) => {
        const matrix = FONT_5X7[ch] || FONT_5X7[' '];
        const baseColIdx = startScaleIdx + (charIdx * totalLetterWidth);

        // In visual piano waterfalls, notes scroll DOWN to the keyboard.
        // Therefore, row 0 (top of the letter) must hit LATER (higher time),
        // and row 6 (bottom of the letter) must hit FIRST (earlier time),
        // so that as it falls onto the screen, it is right-side up!
        const totalRows = matrix.length;

        for (let r = 0; r < totalRows; r++) {
          const rowStr = matrix[r];
          // Bottom row (r = totalRows - 1) hits at time = 0.5s
          // Top row (r = 0) hits at time = 0.5s + (totalRows - 1 - r) * rowDurationSec
          const timeOffset = 0.5 + (totalRows - 1 - r) * rowDurationSec;

          for (let c = 0; c < 5; c++) {
            if (rowStr[c] === '1') {
              const pitchIdx = Math.min(scale.length - 1, baseColIdx + c);
              const pitch = scale[pitchIdx];

              notes.push({
                pitch: pitch,
                startTime: timeOffset,
                duration: rowDurationSec * 1.1,
                velocity: 0.85,
                channel: charIdx % 2
              });
            }
          }
        }
      });
    } else {
      // Sequential: Display letters one after another centered on the keyboard
      const centerIdx = Math.floor(scale.length / 2) - 2;

      chars.forEach((ch, charIdx) => {
        const matrix = FONT_5X7[ch] || FONT_5X7[' '];
        const charStartTime = 0.5 + (charIdx * charSpacingSec);
        const totalRows = matrix.length;

        for (let r = 0; r < totalRows; r++) {
          const rowStr = matrix[r];
          const timeOffset = charStartTime + (totalRows - 1 - r) * rowDurationSec;

          for (let c = 0; c < 5; c++) {
            if (rowStr[c] === '1') {
              const pitchIdx = Math.min(scale.length - 1, Math.max(0, centerIdx + c));
              const pitch = scale[pitchIdx];

              notes.push({
                pitch: pitch,
                startTime: timeOffset,
                duration: rowDurationSec * 1.1,
                velocity: 0.88,
                channel: charIdx % 2
              });
            }
          }
        }
      });
    }

    return notes;
  }

  /**
   * Generates a sequence of shapes (Heart, Star, Smiley) with sound
   */
  static generateShapeParade(shapes = ['HEART', 'SMILEY', 'STAR', 'NOTE']) {
    const scale = SCALES.pentatonic;
    const centerIdx = Math.floor(scale.length / 2) - 2;
    const notes = [];
    const shapeInterval = 2.4;
    const rowDurationSec = 0.18;

    shapes.forEach((shapeKey, shapeIdx) => {
      const matrix = FONT_5X7[shapeKey];
      if (!matrix) return;
      const startTime = 0.6 + shapeIdx * shapeInterval;
      const totalRows = matrix.length;

      for (let r = 0; r < totalRows; r++) {
        const rowStr = matrix[r];
        const timeOffset = startTime + (totalRows - 1 - r) * rowDurationSec;

        for (let c = 0; c < 5; c++) {
          if (rowStr[c] === '1') {
            const pitchIdx = Math.min(scale.length - 1, Math.max(0, centerIdx + c));
            notes.push({
              pitch: scale[pitchIdx],
              startTime: timeOffset,
              duration: rowDurationSec * 1.15,
              velocity: 0.85,
              channel: shapeIdx % 2
            });
          }
        }
      }
    });

    return notes;
  }

  /**
   * Counting Numbers: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
   */
  static generateCountingNumbers(countTo = 10) {
    const scale = SCALES.major;
    const notes = [];
    const stepDuration = 1.9;
    const rowDurationSec = 0.17;

    for (let num = 1; num <= countTo; num++) {
      const str = num.toString();
      const startTime = 0.5 + (num - 1) * stepDuration;

      // Base pitch rises with each number so Henry hears counting up!
      const basePitchIdx = Math.min(scale.length - 10, (num - 1) % 8);

      if (str.length === 1) {
        const matrix = FONT_5X7[str];
        if (!matrix) continue;
        const totalRows = matrix.length;

        for (let r = 0; r < totalRows; r++) {
          const rowStr = matrix[r];
          const timeOffset = startTime + (totalRows - 1 - r) * rowDurationSec;

          for (let c = 0; c < 5; c++) {
            if (rowStr[c] === '1') {
              const pitchIdx = Math.min(scale.length - 1, basePitchIdx + c + 3);
              notes.push({
                pitch: scale[pitchIdx],
                startTime: timeOffset,
                duration: rowDurationSec * 1.15,
                velocity: 0.85,
                channel: (num % 2)
              });
            }
          }
        }
      } else {
        // Two digit numbers (e.g. 10)
        const d1 = str[0];
        const d2 = str[1];
        const m1 = FONT_5X7[d1];
        const m2 = FONT_5X7[d2];
        const totalRows = 7;

        for (let r = 0; r < totalRows; r++) {
          const timeOffset = startTime + (totalRows - 1 - r) * rowDurationSec;
          // Digit 1
          for (let c = 0; c < 5; c++) {
            if (m1[r][c] === '1') {
              const pitchIdx = Math.min(scale.length - 1, basePitchIdx + c);
              notes.push({
                pitch: scale[pitchIdx],
                startTime: timeOffset,
                duration: rowDurationSec * 1.15,
                velocity: 0.85,
                channel: 0
              });
            }
          }
          // Digit 2
          for (let c = 0; c < 5; c++) {
            if (m2[r][c] === '1') {
              const pitchIdx = Math.min(scale.length - 1, basePitchIdx + c + 6);
              notes.push({
                pitch: scale[pitchIdx],
                startTime: timeOffset,
                duration: rowDurationSec * 1.15,
                velocity: 0.85,
                channel: 1
              });
            }
          }
        }
      }
    }

    return notes;
  }
}

window.PatternGenerator = PatternGenerator;
