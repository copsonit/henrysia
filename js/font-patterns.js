/**
 * Henrysia Pattern & Font Engine
 * Translates letters, numbers, and pixel-art shapes into visual piano waterfall notes
 * with musical scale harmonization so patterns sound delightful to Henry.
 */

// ============================================================================
// SINCLAIR ZX SPECTRUM 8x8 FONT MATRIX
// Authentic Sinclair ZX Spectrum ROM Character Set (matching user's reference image)
// ============================================================================
const FONT_SPECTRUM_8X8 = {
  // Numbers (0-9)
  '0': [
    " 1111 ",
    "1   11",
    "1  1 1",
    "1 1  1",
    "11   1",
    "1    1",
    " 1111 ",
    "      "
  ],
  '1': [
    "  11  ",
    " 1 1  ",
    "   1  ",
    "   1  ",
    "   1  ",
    "   1  ",
    " 11111",
    "      "
  ],
  '2': [
    " 1111 ",
    "1    1",
    "     1",
    "   11 ",
    "  1   ",
    " 1    ",
    "111111",
    "      "
  ],
  '3': [
    "11111 ",
    "     1",
    "     1",
    "  111 ",
    "     1",
    "     1",
    "11111 ",
    "      "
  ],
  '4': [
    "1    1",
    "1    1",
    "1    1",
    "111111",
    "     1",
    "     1",
    "     1",
    "      "
  ],
  '5': [
    "111111",
    "1     ",
    "1     ",
    "11111 ",
    "     1",
    "     1",
    "11111 ",
    "      "
  ],
  '6': [
    " 1111 ",
    "1     ",
    "1     ",
    "11111 ",
    "1    1",
    "1    1",
    " 1111 ",
    "      "
  ],
  '7': [
    "111111",
    "     1",
    "    1 ",
    "   1  ",
    "  1   ",
    "  1   ",
    "  1   ",
    "      "
  ],
  '8': [
    " 1111 ",
    "1    1",
    "1    1",
    " 1111 ",
    "1    1",
    "1    1",
    " 1111 ",
    "      "
  ],
  '9': [
    " 1111 ",
    "1    1",
    "1    1",
    " 11111",
    "     1",
    "     1",
    " 1111 ",
    "      "
  ],

  // Uppercase Letters (A-Z)
  'A': [
    " 1111 ",
    "1    1",
    "1    1",
    "111111",
    "1    1",
    "1    1",
    "1    1",
    "      "
  ],
  'B': [
    "11111 ",
    "1    1",
    "1    1",
    "11111 ",
    "1    1",
    "1    1",
    "11111 ",
    "      "
  ],
  'C': [
    " 11111",
    "1     ",
    "1     ",
    "1     ",
    "1     ",
    "1     ",
    " 11111",
    "      "
  ],
  'D': [
    "1111  ",
    "1   1 ",
    "1    1",
    "1    1",
    "1    1",
    "1   1 ",
    "1111  ",
    "      "
  ],
  'E': [
    "111111",
    "1     ",
    "1     ",
    "11111 ",
    "1     ",
    "1     ",
    "111111",
    "      "
  ],
  'F': [
    "111111",
    "1     ",
    "1     ",
    "11111 ",
    "1     ",
    "1     ",
    "1     ",
    "      "
  ],
  'G': [
    " 11111",
    "1     ",
    "1     ",
    "1  111",
    "1    1",
    "1    1",
    " 11111",
    "      "
  ],
  'H': [
    "1    1",
    "1    1",
    "1    1",
    "111111",
    "1    1",
    "1    1",
    "1    1",
    "      "
  ],
  'I': [
    "11111 ",
    "  1   ",
    "  1   ",
    "  1   ",
    "  1   ",
    "  1   ",
    "11111 ",
    "      "
  ],
  'J': [
    "   111",
    "     1",
    "     1",
    "     1",
    "1    1",
    "1    1",
    " 1111 ",
    "      "
  ],
  'K': [
    "1    1",
    "1   1 ",
    "1  1  ",
    "111   ",
    "1  1  ",
    "1   1 ",
    "1    1",
    "      "
  ],
  'L': [
    "1     ",
    "1     ",
    "1     ",
    "1     ",
    "1     ",
    "1     ",
    "111111",
    "      "
  ],
  'M': [
    "1    1",
    "11  11",
    "1 11 1",
    "1 11 1",
    "1    1",
    "1    1",
    "1    1",
    "      "
  ],
  'N': [
    "1    1",
    "11   1",
    "1 1  1",
    "1  1 1",
    "1   11",
    "1    1",
    "1    1",
    "      "
  ],
  'O': [
    " 1111 ",
    "1    1",
    "1    1",
    "1    1",
    "1    1",
    "1    1",
    " 1111 ",
    "      "
  ],
  'P': [
    "11111 ",
    "1    1",
    "1    1",
    "11111 ",
    "1     ",
    "1     ",
    "1     ",
    "      "
  ],
  'Q': [
    " 1111 ",
    "1    1",
    "1    1",
    "1    1",
    "1 1  1",
    "1  1 1",
    " 1111 ",
    "     1"
  ],
  'R': [
    "11111 ",
    "1    1",
    "1    1",
    "11111 ",
    "1  1  ",
    "1   1 ",
    "1    1",
    "      "
  ],
  'S': [
    " 11111",
    "1     ",
    "1     ",
    " 1111 ",
    "     1",
    "     1",
    "11111 ",
    "      "
  ],
  'T': [
    "111111",
    "  11  ",
    "  11  ",
    "  11  ",
    "  11  ",
    "  11  ",
    "  11  ",
    "      "
  ],
  'U': [
    "1    1",
    "1    1",
    "1    1",
    "1    1",
    "1    1",
    "1    1",
    " 1111 ",
    "      "
  ],
  'V': [
    "1    1",
    "1    1",
    "1    1",
    "1    1",
    "1    1",
    " 1  1 ",
    "  11  ",
    "      "
  ],
  'W': [
    "1    1",
    "1    1",
    "1    1",
    "1 11 1",
    "1 11 1",
    "11  11",
    "1    1",
    "      "
  ],
  'X': [
    "1    1",
    "1    1",
    " 1  1 ",
    "  11  ",
    " 1  1 ",
    "1    1",
    "1    1",
    "      "
  ],
  'Y': [
    "1    1",
    "1    1",
    " 1  1 ",
    "  11  ",
    "  11  ",
    "  11  ",
    "  11  ",
    "      "
  ],
  'Z': [
    "111111",
    "     1",
    "    1 ",
    "   1  ",
    "  1   ",
    " 1    ",
    "111111",
    "      "
  ],

  // Lowercase Letters (a-z)
  'a': [
    "      ",
    "      ",
    " 1111 ",
    "     1",
    " 11111",
    "1    1",
    " 11111",
    "      "
  ],
  'b': [
    "1     ",
    "1     ",
    "11111 ",
    "1    1",
    "1    1",
    "1    1",
    "11111 ",
    "      "
  ],
  'c': [
    "      ",
    "      ",
    " 1111 ",
    "1     ",
    "1     ",
    "1     ",
    " 1111 ",
    "      "
  ],
  'd': [
    "     1",
    "     1",
    " 11111",
    "1    1",
    "1    1",
    "1    1",
    " 11111",
    "      "
  ],
  'e': [
    "      ",
    "      ",
    " 1111 ",
    "1    1",
    "111111",
    "1     ",
    " 1111 ",
    "      "
  ],
  'f': [
    "  111 ",
    " 1    ",
    "1111  ",
    " 1    ",
    " 1    ",
    " 1    ",
    " 1    ",
    "      "
  ],
  'g': [
    "      ",
    "      ",
    " 11111",
    "1    1",
    "1    1",
    " 11111",
    "     1",
    " 1111 "
  ],
  'h': [
    "1     ",
    "1     ",
    "11111 ",
    "1    1",
    "1    1",
    "1    1",
    "1    1",
    "      "
  ],
  'i': [
    "  1   ",
    "      ",
    " 11   ",
    "  1   ",
    "  1   ",
    "  1   ",
    " 111  ",
    "      "
  ],
  'j': [
    "   1  ",
    "      ",
    "  11  ",
    "   1  ",
    "   1  ",
    "   1  ",
    "1  1  ",
    " 11   "
  ],
  'k': [
    "1     ",
    "1     ",
    "1   1 ",
    "1  1  ",
    "111   ",
    "1  1  ",
    "1   1 ",
    "      "
  ],
  'l': [
    " 11   ",
    "  1   ",
    "  1   ",
    "  1   ",
    "  1   ",
    "  1   ",
    " 111  ",
    "      "
  ],
  'm': [
    "      ",
    "      ",
    "11 11 ",
    "1 1 1 ",
    "1 1 1 ",
    "1 1 1 ",
    "1   1 ",
    "      "
  ],
  'n': [
    "      ",
    "      ",
    "11111 ",
    "1    1",
    "1    1",
    "1    1",
    "1    1",
    "      "
  ],
  'o': [
    "      ",
    "      ",
    " 1111 ",
    "1    1",
    "1    1",
    "1    1",
    " 1111 ",
    "      "
  ],
  'p': [
    "      ",
    "      ",
    "11111 ",
    "1    1",
    "1    1",
    "11111 ",
    "1     ",
    "1     "
  ],
  'q': [
    "      ",
    "      ",
    " 11111",
    "1    1",
    "1    1",
    " 11111",
    "     1",
    "     1"
  ],
  'r': [
    "      ",
    "      ",
    "11111 ",
    "1   1 ",
    "1     ",
    "1     ",
    "1     ",
    "      "
  ],
  's': [
    "      ",
    "      ",
    " 1111 ",
    "1     ",
    " 1111 ",
    "     1",
    "1111  ",
    "      "
  ],
  't': [
    " 1    ",
    " 1    ",
    "11111 ",
    " 1    ",
    " 1    ",
    " 1  1 ",
    "  11  ",
    "      "
  ],
  'u': [
    "      ",
    "      ",
    "1    1",
    "1    1",
    "1    1",
    "1    1",
    " 11111",
    "      "
  ],
  'v': [
    "      ",
    "      ",
    "1    1",
    "1    1",
    "1    1",
    " 1  1 ",
    "  11  ",
    "      "
  ],
  'w': [
    "      ",
    "      ",
    "1    1",
    "1 11 1",
    "1 11 1",
    "11  11",
    "1    1",
    "      "
  ],
  'x': [
    "      ",
    "      ",
    "1    1",
    " 1  1 ",
    "  11  ",
    " 1  1 ",
    "1    1",
    "      "
  ],
  'y': [
    "      ",
    "      ",
    "1    1",
    "1    1",
    "1    1",
    " 11111",
    "     1",
    " 1111 "
  ],
  'z': [
    "      ",
    "      ",
    "111111",
    "   11 ",
    "  11  ",
    " 11   ",
    "111111",
    "      "
  ],

  // Punctuation & Symbols
  ' ': [
    "   ",
    "   ",
    "   ",
    "   ",
    "   ",
    "   ",
    "   ",
    "   "
  ],
  '!': [
    "  11  ",
    "  11  ",
    "  11  ",
    "  11  ",
    "  11  ",
    "      ",
    "  11  ",
    "      "
  ],
  '?': [
    " 1111 ",
    "1    1",
    "     1",
    "   11 ",
    "   1  ",
    "      ",
    "   1  ",
    "      "
  ],
  '#': [
    " 1  1 ",
    "111111",
    " 1  1 ",
    " 1  1 ",
    "111111",
    " 1  1 ",
    " 1  1 ",
    "      "
  ],
  '$': [
    "  1   ",
    " 11111",
    "1 1   ",
    " 1111 ",
    "  1  1",
    "11111 ",
    "  1   ",
    "      "
  ],
  '%': [
    "11   1",
    "11  1 ",
    "   1  ",
    "  1   ",
    " 1  11",
    "1   11",
    "      ",
    "      "
  ],
  '&': [
    " 11   ",
    "1  1  ",
    " 11   ",
    "1  1 1",
    "1   1 ",
    " 111 1",
    "      ",
    "      "
  ],
  '+': [
    "      ",
    "  11  ",
    "  11  ",
    "111111",
    "  11  ",
    "  11  ",
    "      ",
    "      "
  ],
  '-': [
    "      ",
    "      ",
    "      ",
    "111111",
    "      ",
    "      ",
    "      ",
    "      "
  ],
  '=': [
    "      ",
    "      ",
    "111111",
    "      ",
    "111111",
    "      ",
    "      ",
    "      "
  ],
  '/': [
    "     1",
    "    1 ",
    "   1  ",
    "  1   ",
    " 1    ",
    "1     ",
    "      ",
    "      "
  ],
  '*': [
    "      ",
    "1 11 1",
    " 1111 ",
    "111111",
    " 1111 ",
    "1 11 1",
    "      ",
    "      "
  ],
  ':': [
    "      ",
    "  11  ",
    "  11  ",
    "      ",
    "  11  ",
    "  11  ",
    "      ",
    "      "
  ],
  ';': [
    "      ",
    "  11  ",
    "  11  ",
    "      ",
    "  11  ",
    "  1   ",
    " 1    ",
    "      "
  ],
  '<': [
    "    1 ",
    "   1  ",
    "  1   ",
    " 1    ",
    "  1   ",
    "   1  ",
    "    1 ",
    "      "
  ],
  '>': [
    " 1    ",
    "  1   ",
    "   1  ",
    "    1 ",
    "   1  ",
    "  1   ",
    " 1    ",
    "      "
  ],
  '.': [
    "      ",
    "      ",
    "      ",
    "      ",
    "      ",
    "  11  ",
    "  11  ",
    "      "
  ],
  ',': [
    "      ",
    "      ",
    "      ",
    "      ",
    "  11  ",
    "  1   ",
    " 1    ",
    "      "
  ],
  // Fun Shapes
  'HEART': [
    " 11 11 ",
    "1111111",
    "1111111",
    "1111111",
    " 11111 ",
    "  111  ",
    "   1   ",
    "       "
  ],
  'STAR': [
    "   1   ",
    "  111  ",
    "1111111",
    "  111  ",
    " 11 11 ",
    " 1   1 ",
    "       ",
    "       "
  ],
  'SMILEY': [
    " 1111 ",
    "1    1",
    "1 11 1",
    "1    1",
    "1 11 1",
    "11  11",
    " 1111 ",
    "      "
  ],
  'NOTE': [
    "    11",
    "    11",
    "    1 ",
    "    1 ",
    "  111 ",
    " 1111 ",
    "  11  ",
    "      "
  ]
};

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
  // Retro Video Game Arcade Numbers (as shown in Synthesia & arcade waterfalls)
  '0': [
    " 111 ",
    "1   1",
    "1   1",
    "1   1",
    "1   1",
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
    "  1  "
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
    " 111 ",
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
    "   1 ",
    "  1  ",
    "  1  ",
    "  1  "
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

// ============================================================================
// CHARACTER COLOR SYSTEM (Roadmap: Rainbow for 0-9 & unique color per letter)
// Matches the visual piano arcade waterfall in the user's photo
// ============================================================================

// Rainbow spectrum for numbers 0-9 matching the photo
const DIGIT_COLORS = {
  '0': '#ff3b56', // Vibrant Coral Pink / Red (matches '0' in photo)
  '1': '#ffea00', // Electric Golden Yellow (matches '1' in photo)
  '2': '#00e676', // Bright Green (matches '2' in photo)
  '3': '#00e5ff', // Neon Cyan / Aqua
  '4': '#2979ff', // Electric Sky Blue (matches blue key in photo)
  '5': '#7c4dff', // Deep Purple / Violet
  '6': '#f72585', // Neon Magenta
  '7': '#76ff03', // Neon Lime / Chartreuse (matches '7' in photo)
  '8': '#ff7b00', // Vivid Amber Orange
  '9': '#ff0055'  // Brilliant Crimson Rose
};

// Unique vibrant color for every letter A-Z
const LETTER_COLORS = {
  'A': '#ff2a6d', // Hot Pink
  'B': '#05d9e8', // Cyan
  'C': '#00ff66', // Neon Green
  'D': '#ffb800', // Gold
  'E': '#ff5c00', // Orange
  'F': '#b026ff', // Purple
  'G': '#00f0ff', // Electric Blue
  'H': '#ff0055', // Crimson Pink
  'I': '#ffe600', // Sun Yellow
  'J': '#39ff14', // Neon Lime
  'K': '#00bcd4', // Turquoise
  'L': '#e040fb', // Violet
  'M': '#ff3366', // Coral Red
  'N': '#00e5ff', // Aqua
  'O': '#76ff03', // Lime
  'P': '#ff9100', // Tangerine
  'Q': '#7c4dff', // Deep Indigo
  'R': '#ff1744', // Ruby
  'S': '#00e676', // Emerald
  'T': '#ffd600', // Amber
  'U': '#1de9b6', // Teal
  'V': '#d500f9', // Fuchsia
  'W': '#ff6e40', // Peach Orange
  'X': '#651fff', // Electric Violet
  'Y': '#aeea00', // Chartreuse
  'Z': '#00b0ff'  // Sky Blue
};

// Fun shapes & punctuation
const SYMBOL_COLORS = {
  'HEART': '#ff1744',
  'STAR': '#ffd600',
  'SMILEY': '#00e5ff',
  'NOTE': '#b026ff',
  '!': '#ffea00',
  '?': '#05d9e8'
};

function getCharacterColor(char) {
  if (!char) return '#00e5ff';
  const upper = char.toString().toUpperCase();
  if (DIGIT_COLORS[upper]) return DIGIT_COLORS[upper];
  if (LETTER_COLORS[upper]) return LETTER_COLORS[upper];
  if (SYMBOL_COLORS[upper]) return SYMBOL_COLORS[upper];
  // Deterministic fallback for any other char
  const code = upper.charCodeAt(0);
  const hue = (code * 137.5) % 360;
  return `hsl(${hue}, 100%, 55%)`;
}

// Scale mappings: ensures that rows of pixels sound harmonic rather than dissonant
// MIDI pitches for all 52 white keys on an 88-key piano (A0 to C8)
// Pure C Major diatonic naturals (A, B, C, D, E, F, G) with NO sharps/flats
const WHITE_KEYS_88 = [
  21, 23, 24, 26, 28, 29, 31, 33, 35, 36, 38, 40, 41, 43, 45, 47, 48, 50, 52, 53, 55, 57, 59,
  60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84, 86, 88, 89, 91, 93, 95, 96, 98,
  100, 101, 103, 105, 107, 108
];

// All 88 chromatic keys (MIDI 21 to 108)
const CHROMATIC_88 = Array.from({ length: 88 }, (_, i) => 21 + i);

// Celestial Pentatonic across all octaves
const PENTATONIC_88 = [
  21, 24, 26, 28, 31, 33, 36, 38, 40, 43, 45, 48, 50, 52, 55, 57, 60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96, 98, 100, 103, 105, 108
];

// Celestial Chimes (Arpeggiated chords)
const CHIMES_88 = [
  24, 28, 31, 35, 36, 40, 43, 47, 48, 52, 55, 59, 60, 64, 67, 71, 72, 76, 79, 83, 84, 88, 91, 95, 96, 100, 103, 107, 108
];

const SCALES = {
  whiteKeys: WHITE_KEYS_88,
  major: WHITE_KEYS_88,
  cMajor: WHITE_KEYS_88,
  chromatic: CHROMATIC_88,
  allKeys: CHROMATIC_88,
  pentatonic: PENTATONIC_88,
  chime: CHIMES_88
};

class PatternGenerator {
  static getCharacterColor(char) {
    return getCharacterColor(char);
  }

  static getFont(fontName) {
    if (fontName === 'arcade5x7') return FONT_5X7;
    return FONT_SPECTRUM_8X8;
  }

  static getKeysForScale(scale = 'whiteKeys') {
    if (SCALES[scale]) return SCALES[scale];
    if (scale === 'allKeys' || scale === 'chromatic') return CHROMATIC_88;
    return WHITE_KEYS_88;
  }

  /**
   * Converts any text string into falling visual piano waterfall notes.
   * Mode:
   *  - 'cascade' (default): Multi-line cascade! Words or lines cascade one after another,
   *    each line centered across the piano keys (e.g. "HAPPY" on line 1, "BIRTHDAY" on line 2).
   *  - 'banner': All letters fit across keys simultaneously on one line.
   *  - 'sequential': One single letter at a time centered.
   * Scale defaults to 'whiteKeys' (C Major, only white keys).
   */
  static generateTextNotes(text, options = {}) {
    const rawMode = options.mode || 'cascade';
    const fontName = options.font || 'spectrum';
    const font = PatternGenerator.getFont(fontName);
    const rowDurationSec = options.rowDurationSec || (fontName === 'arcade5x7' ? 0.18 : 0.15);
    const scale = options.scale || 'whiteKeys';
    const availableKeys = PatternGenerator.getKeysForScale(scale);
    const totalKeys = availableKeys.length;
    const notes = [];

    const trimmed = (text || '').trim();
    if (!trimmed) return notes;

    // Helper: generates notes for a single line of text centered across available keys
    const generateSingleLine = (lineStr, startTime, channelOffset = 0) => {
      const chars = lineStr.split('');
      if (chars.length === 0) return 0;

      const getMatrix = (ch) => font[ch] || font[ch.toUpperCase()] || font[' '];

      // Determine optimal character width (6, 5, or 4) and gap (1 or 0)
      // so the line fits without truncation across the available keys (e.g. 52 white keys)
      let charWidth = 6;
      let gap = 1;

      const computeTotalCols = (w, g) => {
        let cols = 0;
        for (let i = 0; i < chars.length; i++) {
          if (chars[i] === ' ') {
            cols += Math.max(2, Math.floor(w / 2));
          } else {
            cols += w;
          }
          if (i < chars.length - 1 && chars[i] !== ' ' && chars[i + 1] !== ' ') {
            cols += g;
          }
        }
        return cols;
      };

      let totalCols = computeTotalCols(charWidth, gap);
      if (totalCols > totalKeys) {
        // Step 1: Condense to 5-col width with 1-col gap (e.g. BIRTHDAY on 52 white keys = 47 cols)
        charWidth = 5;
        gap = 1;
        totalCols = computeTotalCols(charWidth, gap);
      }
      if (totalCols > totalKeys) {
        // Step 2: Try 5-col width with 0 gap
        gap = 0;
        totalCols = computeTotalCols(charWidth, gap);
      }
      if (totalCols > totalKeys) {
        // Step 3: Try 4-col width
        charWidth = 4;
        gap = 1;
        totalCols = computeTotalCols(charWidth, gap);
      }
      if (totalCols > totalKeys) {
        charWidth = 4;
        gap = 0;
        totalCols = computeTotalCols(charWidth, gap);
      }

      // Center the line across available keys
      const centerKeyIdx = Math.floor(totalKeys / 2);
      const startKeyIdx = Math.max(0, centerKeyIdx - Math.floor(totalCols / 2));

      let currentCol = startKeyIdx;
      chars.forEach((ch, charIdx) => {
        if (ch === ' ') {
          currentCol += Math.max(2, Math.floor(charWidth / 2));
          return;
        }

        const matrix = getMatrix(ch);
        const charColor = getCharacterColor(ch);
        const totalRows = matrix.length;
        const nativeCharW = (matrix[0] && matrix[0].length) ? matrix[0].length : 6;

        for (let r = 0; r < totalRows; r++) {
          const rowStr = matrix[r];
          // Row 0 hits later (top), Row 7 hits first (bottom) so it scrolls down right side up
          const timeOffset = startTime + (totalRows - 1 - r) * rowDurationSec;

          for (let c = 0; c < charWidth; c++) {
            let pixelOn = false;
            if (charWidth === nativeCharW) {
              pixelOn = rowStr[c] === '1';
            } else if (charWidth === 5 && nativeCharW === 6) {
              if (c < 4) {
                pixelOn = rowStr[c] === '1';
              } else {
                pixelOn = rowStr[4] === '1' || rowStr[5] === '1';
              }
            } else if (charWidth === 4 && nativeCharW === 6) {
              const sampleCol = Math.min(nativeCharW - 1, Math.round(c * (nativeCharW - 1) / (charWidth - 1)));
              pixelOn = rowStr[sampleCol] === '1';
            } else {
              const sampleCol = Math.min(nativeCharW - 1, Math.floor(c * nativeCharW / charWidth));
              pixelOn = rowStr[sampleCol] === '1';
            }

            if (pixelOn) {
              const colIdx = currentCol + c;
              if (colIdx >= 0 && colIdx < totalKeys) {
                const pitch = availableKeys[colIdx];
                notes.push({
                  pitch: pitch,
                  startTime: timeOffset,
                  duration: rowDurationSec * 1.15,
                  velocity: 0.86,
                  channel: (charIdx + channelOffset) % 2,
                  char: ch.toUpperCase(),
                  charColor: charColor,
                  color: charColor
                });
              }
            }
          }
        }

        currentCol += charWidth;
        if (charIdx < chars.length - 1 && chars[charIdx + 1] !== ' ') {
          currentCol += gap;
        }
      });

      return 8 * rowDurationSec; // duration of line in seconds
    };

    if (rawMode === 'sequential') {
      // Sequential: one single character at a time centered
      const charSpacingSec = options.charSpacingSec || 1.6;
      const chars = trimmed.split('');
      const centerKeyIdx = Math.floor(totalKeys / 2) - 3;

      chars.forEach((ch, charIdx) => {
        if (ch === ' ') return;
        const matrix = font[ch] || font[ch.toUpperCase()] || font[' '];
        const charStartTime = 0.5 + (charIdx * charSpacingSec);
        const charColor = getCharacterColor(ch);
        const totalRows = matrix.length;
        const charWidth = matrix[0] ? matrix[0].length : 6;

        for (let r = 0; r < totalRows; r++) {
          const rowStr = matrix[r];
          const timeOffset = charStartTime + (totalRows - 1 - r) * rowDurationSec;

          for (let c = 0; c < charWidth; c++) {
            if (rowStr[c] === '1') {
              const colIdx = centerKeyIdx + c;
              if (colIdx >= 0 && colIdx < totalKeys) {
                const pitch = availableKeys[colIdx];
                notes.push({
                  pitch: pitch,
                  startTime: timeOffset,
                  duration: rowDurationSec * 1.15,
                  velocity: 0.88,
                  channel: charIdx % 2,
                  char: ch.toUpperCase(),
                  charColor: charColor,
                  color: charColor
                });
              }
            }
          }
        }
      });
    } else if (rawMode === 'banner') {
      // Single Wide Banner across keys
      generateSingleLine(trimmed, 0.5, 0);
    } else {
      // Cascade / Multi-line mode:
      let lines = [];
      if (trimmed.includes('\n')) {
        lines = trimmed.split(/\n+/).map(l => l.trim()).filter(Boolean);
      } else if (trimmed.includes(' ')) {
        // Multi-word phrase: e.g. "HAPPY BIRTHDAY" -> "HAPPY", "BIRTHDAY"
        lines = trimmed.split(/\s+/).filter(Boolean);
      } else {
        lines = [trimmed];
      }

      let currentTime = 0.5;
      const lineGapSec = options.lineGapSec || 0.65; // gap between cascading lines

      lines.forEach((lineText, lineIdx) => {
        const lineDuration = generateSingleLine(lineText, currentTime, lineIdx);
        currentTime += lineDuration + lineGapSec;
      });
    }

    return notes;
  }

  /**
   * Generates a sequence of shapes (Heart, Star, Smiley) with sound and colors
   * Defaults to C Major white keys
   */
  static generateShapeParade(shapes = ['HEART', 'SMILEY', 'STAR', 'NOTE'], options = {}) {
    const fontName = options.font || 'spectrum';
    const font = PatternGenerator.getFont(fontName);
    const scale = options.scale || 'whiteKeys';
    const availableKeys = PatternGenerator.getKeysForScale(scale);
    const totalKeys = availableKeys.length;
    const notes = [];
    const shapeInterval = 2.4;
    const rowDurationSec = 0.16;
    const centerKeyIdx = Math.floor(totalKeys / 2) - 3;

    shapes.forEach((shapeKey, shapeIdx) => {
      const matrix = font[shapeKey] || FONT_SPECTRUM_8X8[shapeKey];
      if (!matrix) return;
      const startTime = 0.6 + shapeIdx * shapeInterval;
      const totalRows = matrix.length;
      const charWidth = matrix[0] ? matrix[0].length : 6;
      const shapeColor = getCharacterColor(shapeKey);

      for (let r = 0; r < totalRows; r++) {
        const rowStr = matrix[r];
        const timeOffset = startTime + (totalRows - 1 - r) * rowDurationSec;

        for (let c = 0; c < charWidth; c++) {
          if (rowStr[c] === '1') {
            const colIdx = centerKeyIdx + c;
            if (colIdx >= 0 && colIdx < totalKeys) {
              notes.push({
                pitch: availableKeys[colIdx],
                startTime: timeOffset,
                duration: rowDurationSec * 1.15,
                velocity: 0.85,
                channel: shapeIdx % 2,
                char: shapeKey,
                charColor: shapeColor,
                color: shapeColor
              });
            }
          }
        }
      }
    });

    return notes;
  }

  /**
   * Counting Numbers: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
   * centered across keyboard with Sinclair Spectrum 8x8 font and C Major white keys
   */
  static generateCountingNumbers(countTo = 10, options = {}) {
    const fontName = options.font || 'spectrum';
    const font = PatternGenerator.getFont(fontName);
    const scale = options.scale || 'whiteKeys';
    const availableKeys = PatternGenerator.getKeysForScale(scale);
    const totalKeys = availableKeys.length;
    const notes = [];
    const stepDuration = 1.9;
    const rowDurationSec = 0.14;

    for (let num = 1; num <= countTo; num++) {
      const str = num.toString();
      const startTime = 0.5 + (num - 1) * stepDuration;
      const numDigits = str.length;
      const digitWidth = 6;
      const totalColumns = numDigits * digitWidth + (numDigits - 1);

      const centerKeyIdx = Math.floor(totalKeys / 2);
      const startKeyIdx = Math.max(0, centerKeyIdx - Math.floor(totalColumns / 2));

      for (let dIdx = 0; dIdx < numDigits; dIdx++) {
        const d = str[dIdx];
        const matrix = font[d] || font['0'];
        const digitBaseCol = startKeyIdx + dIdx * (digitWidth + 1);
        const digitColor = getCharacterColor(d);
        const totalRows = matrix.length;
        const charW = matrix[0] ? matrix[0].length : digitWidth;

        for (let r = 0; r < totalRows; r++) {
          const rowStr = matrix[r];
          const timeOffset = startTime + (totalRows - 1 - r) * rowDurationSec;

          for (let c = 0; c < charW; c++) {
            if (rowStr[c] === '1') {
              const colIdx = digitBaseCol + c;
              if (colIdx >= 0 && colIdx < totalKeys) {
                notes.push({
                  pitch: availableKeys[colIdx],
                  startTime: timeOffset,
                  duration: rowDurationSec * 1.15,
                  velocity: 0.88,
                  channel: dIdx % 2,
                  char: d,
                  charColor: digitColor,
                  color: digitColor
                });
              }
            }
          }
        }
      }
    }

    return notes;
  }

  /**
   * Generates a rapid retro arcade number stream from 1 up to 100,000
   * centered across the keyboard with rainbow digit colors, Sinclair Spectrum font,
   * and harmonious C Major white keys!
   */
  static generateNumberStream(options = {}) {
    const fontName = options.font || 'spectrum';
    const font = PatternGenerator.getFont(fontName);
    const scale = options.scale || 'whiteKeys';
    const availableKeys = PatternGenerator.getKeysForScale(scale);
    const totalKeys = availableKeys.length;
    const notes = [];
    const rowDurationSec = options.rowDurationSec || 0.11;
    const intervalSec = options.intervalSec || 0.35; // gap between numbers

    // Progression of numbers from 1 to 100,000 highlighting the 10,720 showcase from the photo
    const defaultNumbers = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      15, 20, 50, 75, 100, 150, 250, 500, 750, 1000,
      1500, 2500, 5000, 7500, 9999, 10000,
      10500, 10700, 10718, 10719, 10720, 10721, 10722, 10725, 10750, 10800,
      12500, 15000, 20000, 35000, 50000, 65000, 75000, 88888, 95000, 99999, 100000
    ];

    const numberList = options.numbers || defaultNumbers;
    let currentTime = 0.5;

    numberList.forEach((num, seqIdx) => {
      const numStr = num.toString();
      const numDigits = numStr.length;
      const digitWidth = 6;
      const totalColumns = numDigits * digitWidth + (numDigits - 1);

      const centerKeyIdx = Math.floor(totalKeys / 2);
      const startKeyIdx = Math.max(0, centerKeyIdx - Math.floor(totalColumns / 2));

      for (let dIdx = 0; dIdx < numDigits; dIdx++) {
        const digitChar = numStr[dIdx];
        const matrix = font[digitChar] || font['0'];
        const digitBaseCol = startKeyIdx + (dIdx * (digitWidth + 1));
        const digitColor = getCharacterColor(digitChar);
        const totalRows = matrix.length;
        const charW = matrix[0] ? matrix[0].length : digitWidth;

        for (let r = 0; r < totalRows; r++) {
          const rowStr = matrix[r];
          const timeOffset = currentTime + (totalRows - 1 - r) * rowDurationSec;

          for (let c = 0; c < charW; c++) {
            if (rowStr[c] === '1') {
              const colIdx = digitBaseCol + c;
              if (colIdx >= 0 && colIdx < totalKeys) {
                notes.push({
                  pitch: availableKeys[colIdx],
                  startTime: timeOffset,
                  duration: rowDurationSec * 1.15,
                  velocity: 0.88,
                  channel: dIdx % 2,
                  char: digitChar,
                  charColor: digitColor,
                  color: digitColor,
                  num: num
                });
              }
            }
          }
        }
      }

      const totalNumHeightSec = 8 * rowDurationSec;
      currentTime += totalNumHeightSec + intervalSec;
    });

    return notes;
  }

  /**
   * Generates a stepped counting pattern from 1 up to 100,000 using the original Sinclair Spectrum 8x8 font:
   * - 1 to 100 with increment of 1 (1, 2, ..., 100)
   * - 100 to 1,000 with increment of 10 (110, 120, ..., 1000)
   * - 1,000 to 10,000 with increment of 100 (1100, 1200, ..., 10000)
   * - 10,000 to 100,000 with increment of 1,000 (11000, 12000, ..., 100000)
   */
  /**
   * Generates a stepped counting pattern from 1 up to 100,000 using the original Sinclair Spectrum 8x8 font:
   * - 1 to 100 with increment of 1 (1, 2, ..., 100)
   * - 100 to 1,000 with increment of 10 (110, 120, ..., 1000)
   * - 1,000 to 10,000 with increment of 100 (1100, 1200, ..., 10000)
   * - 10,000 to 100,000 with increment of 1,000 (11000, 12000, ..., 100000)
   *
   * Staggered diagonal zig-zag animation:
   * - Each step advances time by half a character up (4 rows out of 8)
   * - Horizontally steps across the keyboard from left to right with spacing (1, 2 higher up to the right, 3 higher etc),
   *   reaches the right edge, and zig-zags back to the left!
   */
  static generateSteppedNumberStream(options = {}) {
    const fontName = options.font || 'spectrum';
    const font = PatternGenerator.getFont(fontName);
    const scale = options.scale || 'whiteKeys';
    const availableKeys = PatternGenerator.getKeysForScale(scale);
    const totalKeys = availableKeys.length;
    const rowDurationSec = options.rowDurationSec || 0.10;
    const totalRows = 8;
    const charHeightSec = totalRows * rowDurationSec;
    const stepRows = options.stepRows || 4; // Half a character up for next number (4 rows out of 8)
    const halfCharSec = stepRows * rowDurationSec;
    const clearMarginSec = 2 * rowDurationSec; // 2 rows buffer so numbers never visually collide or touch
    const colFreeTime = new Float32Array(totalKeys);
    const notes = [];

    const numbers = [];
    // 1 to 100 with increment of 1
    for (let i = 1; i <= 100; i += 1) numbers.push(i);
    // 100 to 1,000 with increment of 10
    for (let i = 110; i <= 1000; i += 10) numbers.push(i);
    // 1,000 to 10,000 with increment of 100
    for (let i = 1100; i <= 10000; i += 100) numbers.push(i);
    // 10,000 to 100,000 with increment of 1,000
    for (let i = 11000; i <= 100000; i += 1000) numbers.push(i);

    let prevNumberTime = (options.startTime || 0.5) - halfCharSec;
    let currentCol = 0;
    let dir = 1; // 1 = moving right, -1 = moving left

    numbers.forEach((num) => {
      const numStr = num.toString();
      const numDigits = numStr.length;
      const digitWidth = 6;
      const totalColumns = numDigits * digitWidth + (numDigits - 1);
      const maxStartCol = Math.max(0, totalKeys - totalColumns);

      // Horizontal position for this number
      const startKeyIdx = Math.max(0, Math.min(maxStartCol, Math.round(currentCol)));
      const endKeyIdx = startKeyIdx + totalColumns - 1;

      // Base timing: next number steps up half a character (0.5 character advance)
      const candidateTime = prevNumberTime + halfCharSec;

      // Check if any occupied columns are still busy from a previous number
      let maxBusyTime = 0;
      for (let c = startKeyIdx; c <= endKeyIdx; c++) {
        if (c >= 0 && c < totalKeys && colFreeTime[c] > maxBusyTime) {
          maxBusyTime = colFreeTime[c];
        }
      }

      // If columns would overlap with an active number, delay in time until clear (+0.5-1 char gap)
      const numberTime = Math.max(candidateTime, maxBusyTime);

      // Render all digits of this number at the EXACT SAME time
      for (let dIdx = 0; dIdx < numDigits; dIdx++) {
        const digitChar = numStr[dIdx];
        const matrix = font[digitChar] || font['0'];
        const digitBaseCol = startKeyIdx + (dIdx * (digitWidth + 1));
        const digitColor = getCharacterColor(digitChar);
        const charW = matrix[0] ? matrix[0].length : digitWidth;

        for (let r = 0; r < totalRows; r++) {
          const rowStr = matrix[r];
          // Bottom row hits keys first at numberTime, top row hits last
          const timeOffset = numberTime + (totalRows - 1 - r) * rowDurationSec;

          for (let c = 0; c < charW; c++) {
            if (rowStr[c] === '1') {
              const colIdx = digitBaseCol + c;
              if (colIdx >= 0 && colIdx < totalKeys) {
                notes.push({
                  pitch: availableKeys[colIdx],
                  startTime: timeOffset,
                  duration: rowDurationSec * 1.15,
                  velocity: 0.88,
                  channel: dIdx % 2,
                  char: digitChar,
                  charColor: digitColor,
                  color: digitColor,
                  num: num
                });
              }
            }
          }
        }
      }

      // Mark columns as busy until this number has completely finished + clear margin
      const finishTime = numberTime + charHeightSec + clearMarginSec;
      for (let c = startKeyIdx; c <= endKeyIdx; c++) {
        if (c >= 0 && c < totalKeys) {
          colFreeTime[c] = finishTime;
        }
      }
      prevNumberTime = numberTime;

      // Step horizontally across the keyboard (spaced apart so adjacent numbers don't overlap)
      const colStep = Math.max(8, totalColumns + 2);
      if (dir === 1) {
        if (currentCol + colStep >= maxStartCol) {
          currentCol = maxStartCol;
          dir = -1;
        } else {
          currentCol += colStep;
        }
      } else {
        if (currentCol - colStep <= 0) {
          currentCol = 0;
          dir = 1;
        } else {
          currentCol -= colStep;
        }
      }
    });

    // Ensure notes are strictly sorted by startTime for binary search lookahead
    notes.sort((a, b) => a.startTime - b.startTime);

    return notes;
  }

  /**
   * Generates large 3D beveled gem numbers (1-1000) matching the YouTube video (PianoBit)
   * with tall 21-row HD fonts, sustained vertical stems, square cushion gems,
   * and a seamless left-to-right rainbow spectrum!
   */
  static generateHDNumbers(numbers = [123, 456, 789], options = {}) {
    const font = FONT_HD_GEMS;
    const scale = options.scale || 'whiteKeys';
    const availableKeys = PatternGenerator.getKeysForScale(scale);
    const totalKeys = availableKeys.length;
    const rowDurationSec = options.rowDurationSec || 0.12;
    const intervalSec = options.intervalSec || 0.55;
    const notes = [];
    let currentTime = options.startTime || 0.6;

    const toHex = window.hslToHex || ((h, s, l) => `hsl(${h}, ${s}%, ${l}%)`);

    numbers.forEach((num, seqIdx) => {
      const numStr = num.toString();
      const numDigits = numStr.length;
      const digitWidth = 11;
      let gap = 4;
      if (numDigits === 4) gap = 1;
      else if (numDigits === 2) gap = 6;
      else if (numDigits === 1) gap = 0;

      const totalColumns = numDigits * digitWidth + (numDigits - 1) * gap;
      const centerKeyIdx = Math.floor(totalKeys / 2);
      const startKeyIdx = Math.max(0, centerKeyIdx - Math.floor(totalColumns / 2));

      for (let dIdx = 0; dIdx < numDigits; dIdx++) {
        const digitChar = numStr[dIdx];
        const matrix = font[digitChar] || font['0'];
        const digitBaseCol = startKeyIdx + dIdx * (digitWidth + gap);
        const totalRows = matrix.length;
        const charW = matrix[0] ? matrix[0].length : digitWidth;

        // Scan columns to find consecutive runs of '1's
        // Vertical runs (>= 2 rows) are merged into continuous sustained 3D gem capsule stems!
        for (let c = 0; c < charW; c++) {
          const colIdx = digitBaseCol + c;
          if (colIdx < 0 || colIdx >= totalKeys) continue;
          const pitch = availableKeys[colIdx];

          // Seamless left-to-right rainbow hue: 18° (orange/amber) to 285° (purple/magenta)
          const colRatio = colIdx / Math.max(1, totalKeys - 1);
          const hue = Math.round(18 + colRatio * 267);
          const gemColor = toHex(hue, 100, 52);

          let r = 0;
          while (r < totalRows) {
            if (matrix[r][c] === '1') {
              const startR = r;
              while (r < totalRows && matrix[r][c] === '1') {
                r++;
              }
              const runLength = r - startR;
              // Matrix row totalRows - 1 is the bottom of the digit (hits keys first)
              const earliestRow = r - 1;
              const timeOffset = currentTime + (totalRows - 1 - earliestRow) * rowDurationSec;
              const isStem = runLength >= 2;
              const duration = isStem ? (runLength * rowDurationSec) : (rowDurationSec * 1.05);

              notes.push({
                pitch: pitch,
                startTime: timeOffset,
                duration: duration,
                velocity: 0.88,
                channel: dIdx % 2,
                char: digitChar,
                charColor: gemColor,
                color: gemColor,
                isGem: true,
                isStem: isStem,
                num: num
              });
            } else {
              r++;
            }
          }
        }
      }

      const totalNumHeightSec = 21 * rowDurationSec;
      currentTime += totalNumHeightSec + intervalSec;
    });

    return notes;
  }

  /**
   * Generates complete 1 to 1,000 counting without any skips
   * in giant 3D HD beveled gem digits spanning ~38-42 minutes (matching the PianoBit video).
   */
  static generateCounting1To1000(options = {}) {
    const numbers = [];
    for (let i = 1; i <= 1000; i++) {
      numbers.push(i);
    }
    return PatternGenerator.generateHDNumbers(numbers, {
      scale: options.scale || 'whiteKeys',
      rowDurationSec: options.rowDurationSec || 0.09,
      intervalSec: options.intervalSec || 0.40,
      startTime: options.startTime || 0.6
    });
  }

  /**
   * Generates the powers of 2 binary progression sequence (2^1 = 2 up to 2^32 = 4,294,967,296)
   * using compact retro arcade fonts (FONT_5X7 and FONT_4X7) so huge numbers fit across
   * the keyboard without clipping.
   */
  static generatePowersOfTwo(options = {}) {
    const scale = options.scale || 'whiteKeys';
    const availableKeys = PatternGenerator.getKeysForScale(scale);
    const totalKeys = availableKeys.length;
    const rowDurationSec = options.rowDurationSec || 0.13;
    const intervalSec = options.intervalSec || 0.45;
    const toHex = window.hslToHex || ((h, s, l) => `hsl(${h}, ${s}%, ${l}%)`);
    const notes = [];
    let currentTime = options.startTime || 0.6;

    // Powers of 2 from 2^1 (2) up to 2^32 (4,294,967,296)
    const powers = [];
    let currentVal = 2;
    for (let exp = 1; exp <= 32; exp++) {
      powers.push({ exp, val: currentVal });
      currentVal *= 2;
    }

    powers.forEach(({ exp, val }) => {
      const numStr = val.toString();
      const numDigits = numStr.length;

      // Select font based on digit count: FONT_5X7 for <= 7 digits, FONT_4X7 for 8+ digits
      const useCompact = numDigits >= 8;
      const font = useCompact ? FONT_4X7 : FONT_5X7;
      const digitWidth = useCompact ? 4 : 5;
      const gap = useCompact ? 1 : (numDigits <= 4 ? 2 : 1);

      const totalColumns = numDigits * digitWidth + (numDigits - 1) * gap;
      const centerKeyIdx = Math.floor(totalKeys / 2);
      const startKeyIdx = Math.max(0, centerKeyIdx - Math.floor(totalColumns / 2));

      for (let dIdx = 0; dIdx < numDigits; dIdx++) {
        const d = numStr[dIdx];
        const matrix = font[d] || font['0'];
        const totalRows = matrix.length;
        const charW = matrix[0] ? matrix[0].length : digitWidth;
        const digitBaseCol = startKeyIdx + dIdx * (digitWidth + gap);

        for (let r = 0; r < totalRows; r++) {
          const rowStr = matrix[r];
          // Bottom row hits keys first
          const timeOffset = currentTime + (totalRows - 1 - r) * rowDurationSec;

          for (let c = 0; c < charW; c++) {
            if (rowStr[c] === '1') {
              const colIdx = digitBaseCol + c;
              if (colIdx >= 0 && colIdx < totalKeys) {
                const pitch = availableKeys[colIdx];
                const colRatio = colIdx / Math.max(1, totalKeys - 1);
                const hue = Math.round(18 + colRatio * 267);
                const color = toHex(hue, 100, 52);

                notes.push({
                  pitch: pitch,
                  startTime: timeOffset,
                  duration: rowDurationSec * 1.15,
                  velocity: 0.88,
                  channel: exp % 2,
                  char: d,
                  charColor: color,
                  color: color,
                  isPowerOfTwo: true,
                  exp: exp,
                  val: val
                });
              }
            }
          }
        }
      }

      const totalNumHeightSec = 7 * rowDurationSec;
      currentTime += totalNumHeightSec + intervalSec;
    });

    return notes;
  }
}

// ============================================================================
// HD 21-ROW GEM NUMBER FONT MATRIX (Authentic PianoBit YouTube Aesthetic)
// Large, high-definition curved digits spanning 21 rows by 11 columns
// ============================================================================
const FONT_HD_GEMS = {
  // Digit 1 (matches Image 1: diagonal top hook, tall continuous stem at col 7, wide 11-gem base at row 20)
  '1': [
    "       1   ",
    "      11   ",
    "     1 1   ",
    "    1  1   ",
    "   1   1   ",
    "       1   ",
    "       1   ",
    "       1   ",
    "       1   ",
    "       1   ",
    "       1   ",
    "       1   ",
    "       1   ",
    "       1   ",
    "       1   ",
    "       1   ",
    "       1   ",
    "       1   ",
    "       1   ",
    "       1   ",
    "11111111111"
  ],

  // Digit 2 (matches Image 1: rounded top arch, smooth diagonal staircase, flat base)
  '2': [
    "   11111   ",
    "  1     1  ",
    " 1       1 ",
    "1         1",
    "          1",
    "          1",
    "         1 ",
    "        1  ",
    "       1   ",
    "      1    ",
    "     1     ",
    "    1      ",
    "   1       ",
    "  1        ",
    " 1         ",
    "1          ",
    "1          ",
    "1          ",
    "1          ",
    "11111111111",
    "11111111111"
  ],

  // Digit 3 (matches Image 1: flat top, upper curve, central horizontal cusp, lower sweeping curve)
  '3': [
    " 111111111 ",
    "1         1",
    "          1",
    "          1",
    "          1",
    "         1 ",
    "       11  ",
    "    111    ",
    "       11  ",
    "         1 ",
    "          1",
    "          1",
    "          1",
    "          1",
    "          1",
    "          1",
    "         1 ",
    "        1  ",
    "1      1   ",
    " 111111    ",
    "           "
  ],

  // Digit 4 (matches Image 2: tall vertical stem at col 9, diagonal from top-left, horizontal crossbar)
  '4': [
    "         1 ",
    "        11 ",
    "       1 1 ",
    "      1  1 ",
    "     1   1 ",
    "    1    1 ",
    "   1     1 ",
    "  1      1 ",
    " 1       1 ",
    "1        1 ",
    "1        1 ",
    "1        1 ",
    "1        1 ",
    "11111111111",
    "11111111111",
    "         1 ",
    "         1 ",
    "         1 ",
    "         1 ",
    "         1 ",
    "         1 "
  ],

  // Digit 5 (matches Image 2: top bar, left stem, middle bar, lower loop)
  '5': [
    "1111111111 ",
    "1          ",
    "1          ",
    "1          ",
    "1          ",
    "1          ",
    "1          ",
    "11111111   ",
    "        11 ",
    "          1",
    "          1",
    "          1",
    "          1",
    "          1",
    "          1",
    "         1 ",
    "        1  ",
    "1      1   ",
    " 111111    ",
    "           ",
    "           "
  ],

  // Digit 6 (matches Image 2: top arch from right, left stem, closed bottom loop)
  '6': [
    "    11111  ",
    "   1     1 ",
    "  1        ",
    " 1         ",
    "1          ",
    "1          ",
    "1          ",
    "1  11111   ",
    "1 1     1  ",
    "11       1 ",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    " 1       1 ",
    "  1     1  ",
    "   11111   ",
    "           ",
    "           "
  ],

  // Digit 7 (matches Image 3: top horizontal bar with left ear, diagonal sweep down)
  '7': [
    "11111111111",
    "1         1",
    "1        1 ",
    "        1  ",
    "       1   ",
    "       1   ",
    "      1    ",
    "      1    ",
    "     1     ",
    "     1     ",
    "    1      ",
    "    1      ",
    "   1       ",
    "   1       ",
    "  1        ",
    "  1        ",
    " 1         ",
    " 1         ",
    "1          ",
    "1          ",
    "1          "
  ],

  // Digit 8 (matches Image 3: smaller upper loop, slightly wider lower loop)
  '8': [
    "   11111   ",
    "  1     1  ",
    " 1       1 ",
    " 1       1 ",
    " 1       1 ",
    " 1       1 ",
    "  1     1  ",
    "   11111   ",
    "  1     1  ",
    " 1       1 ",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    " 1       1 ",
    "  1     1  ",
    "   11111   ",
    "           ",
    "           "
  ],

  // Digit 9 (matches Image 3: closed upper loop, right stem, bottom hook curving left)
  '9': [
    "   11111   ",
    "  1     1  ",
    " 1       1 ",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    " 1       11",
    "  1     1 1",
    "   11111  1",
    "          1",
    "          1",
    "          1",
    "          1",
    "          1",
    "          1",
    "         1 ",
    "        1  ",
    "  111111   ",
    " 1         ",
    "           "
  ],

  // Digit 0 (tall rounded oval)
  '0': [
    "   11111   ",
    "  1     1  ",
    " 1       1 ",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    "1         1",
    " 1       1 ",
    "  1     1  ",
    "   11111   ",
    "           ",
    "           "
  ]
};

// ============================================================================
// ULTRA-COMPACT 4x7 MATRIX (For large numbers with 8+ digits, e.g. Powers of 2)
// ============================================================================
const FONT_4X7 = {
  '0': [
    "1111",
    "1  1",
    "1  1",
    "1  1",
    "1  1",
    "1  1",
    "1111"
  ],
  '1': [
    " 11 ",
    "  1 ",
    "  1 ",
    "  1 ",
    "  1 ",
    "  1 ",
    " 111"
  ],
  '2': [
    "1111",
    "   1",
    "   1",
    "1111",
    "1   ",
    "1   ",
    "1111"
  ],
  '3': [
    "1111",
    "   1",
    "   1",
    "1111",
    "   1",
    "   1",
    "1111"
  ],
  '4': [
    "1  1",
    "1  1",
    "1  1",
    "1111",
    "   1",
    "   1",
    "   1"
  ],
  '5': [
    "1111",
    "1   ",
    "1   ",
    "1111",
    "   1",
    "   1",
    "1111"
  ],
  '6': [
    "1111",
    "1   ",
    "1   ",
    "1111",
    "1  1",
    "1  1",
    "1111"
  ],
  '7': [
    "1111",
    "   1",
    "   1",
    "  1 ",
    "  1 ",
    " 1  ",
    " 1  "
  ],
  '8': [
    "1111",
    "1  1",
    "1  1",
    "1111",
    "1  1",
    "1  1",
    "1111"
  ],
  '9': [
    "1111",
    "1  1",
    "1  1",
    "1111",
    "   1",
    "   1",
    "1111"
  ]
};

window.PatternGenerator = PatternGenerator;
window.FONT_SPECTRUM_8X8 = FONT_SPECTRUM_8X8;
window.FONT_5X7 = FONT_5X7;
window.FONT_4X7 = FONT_4X7;
window.FONT_HD_GEMS = FONT_HD_GEMS;
window.DIGIT_COLORS = DIGIT_COLORS;
window.LETTER_COLORS = LETTER_COLORS;
window.WHITE_KEYS_88 = WHITE_KEYS_88;
window.CHROMATIC_88 = CHROMATIC_88;
window.PENTATONIC_88 = PENTATONIC_88;
window.CHIMES_88 = CHIMES_88;
window.SCALES = SCALES;
window.getCharacterColor = getCharacterColor;


