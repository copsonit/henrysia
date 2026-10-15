/**
 * Henrysia Piano Keyboard Model
 * Computes exact 88-key geometry, handles touch/mouse/keyboard inputs,
 * and tracks key states for the visual piano visualizer.
 */

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const BLACK_KEY_PATTERN = [false, true, false, true, false, false, true, false, true, false, true, false];

function hexToRgba(hex, alpha = 1) {
  if (!hex) return `rgba(0, 229, 255, ${alpha})`;
  if (hex.startsWith('rgba')) return hex;
  if (hex.startsWith('rgb')) {
    return hex.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
  }
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return `rgba(0, 229, 255, ${alpha})`;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
window.hexToRgba = hexToRgba;

class PianoKeyboard {
  constructor(options = {}) {
    this.minMidi = options.minMidi || 21;  // A0 default
    this.maxMidi = options.maxMidi || 108; // C8 default (88 keys)
    this.activeKeys = new Map(); // midiNote -> { color, velocity, isUser, isSong }
    this.showLabels = true;
    this.labelMode = 'letter'; // 'letter' (C4), 'solfege' (Do4), 'none'
    this.keyRangePreset = '88'; // '88', '61', '49', 'auto'
    this.songMinMidi = 21;
    this.songMaxMidi = 108;
    this.lastWidth = 0;
    this.lastHeight = 0;
    this.lastKeyboardHeight = 0;

    // Callbacks
    this.onNoteOn = options.onNoteOn || null;
    this.onNoteOff = options.onNoteOff || null;

    // Mouse/touch dragging state
    this.isPointerDown = false;
    this.currentPointerNote = null;
    this.touchPointers = new Map(); // pointerId -> midiNote

    // Cached key layouts
    this.keys = [];
    this.whiteKeyCount = 0;
    this.buildKeyMap();
  }

  setKeyRange(preset, songNotes = null) {
    this.keyRangePreset = preset;
    if (preset === '49') {
      this.minMidi = 36; // C2
      this.maxMidi = 84; // C6
    } else if (preset === '61') {
      this.minMidi = 36; // C2
      this.maxMidi = 96; // C7
    } else if (preset === '76') {
      this.minMidi = 28; // E1
      this.maxMidi = 103; // G7
    } else if (preset === 'auto' && songNotes && songNotes.length > 0) {
      let low = 127;
      let high = 0;
      songNotes.forEach(n => {
        if (n.pitch < low) low = n.pitch;
        if (n.pitch > high) high = n.pitch;
      });
      // Expand with a couple notes margin and align to nearest C if possible
      low = Math.max(21, Math.min(low - 2, 48));
      high = Math.min(108, Math.max(high + 2, 72));
      this.minMidi = low;
      this.maxMidi = high;
    } else {
      // 88 keys
      this.minMidi = 21;
      this.maxMidi = 108;
    }
    this.buildKeyMap();
    if (this.lastWidth && this.lastHeight && this.lastKeyboardHeight) {
      this.updateLayout(this.lastWidth, this.lastHeight, this.lastKeyboardHeight);
    }
  }

  buildKeyMap() {
    this.keys = [];
    let whiteIndex = 0;

    // First pass: identify white and black keys
    for (let midi = this.minMidi; midi <= this.maxMidi; midi++) {
      const semitone = midi % 12;
      const octave = Math.floor(midi / 12) - 1;
      const isBlack = BLACK_KEY_PATTERN[semitone];
      const noteName = NOTE_NAMES[semitone];

      const keyObj = {
        midi,
        name: noteName,
        fullName: `${noteName}${octave}`,
        isBlack,
        whiteIndex: isBlack ? -1 : whiteIndex,
        octave,
        semitone,
        // Geometry will be computed dynamically on resize
        x: 0,
        y: 0,
        width: 0,
        height: 0
      };

      if (!isBlack) whiteIndex++;
      this.keys.push(keyObj);
    }
    this.whiteKeyCount = whiteIndex;
  }

  /**
   * Updates key layout pixel boundaries for a given canvas dimensions
   */
  updateLayout(width, height, keyboardHeight) {
    this.lastWidth = width;
    this.lastHeight = height;
    this.lastKeyboardHeight = keyboardHeight;
    if (this.whiteKeyCount === 0) return;

    const whiteKeyWidth = width / this.whiteKeyCount;
    const blackKeyWidth = whiteKeyWidth * 0.62;
    const blackKeyHeight = keyboardHeight * 0.63;
    const topY = height - keyboardHeight;

    let whiteCounter = 0;

    // First place all white keys
    this.keys.forEach(k => {
      if (!k.isBlack) {
        k.x = whiteCounter * whiteKeyWidth;
        k.y = topY;
        k.width = whiteKeyWidth;
        k.height = keyboardHeight;
        whiteCounter++;
      }
    });

    // Next place black keys relative to surrounding white keys
    this.keys.forEach((k, idx) => {
      if (k.isBlack) {
        // Find previous white key
        let prevWhite = null;
        for (let i = idx - 1; i >= 0; i--) {
          if (!this.keys[i].isBlack) {
            prevWhite = this.keys[i];
            break;
          }
        }
        if (prevWhite) {
          // Fine-tune offset based on black key position in octave (C# and F# lean slightly left, G# centered, D# and A# lean right)
          let offsetFactor = 0.5;
          const semitone = k.semitone;
          if (semitone === 1) offsetFactor = 0.42;      // C#
          else if (semitone === 3) offsetFactor = 0.58; // D#
          else if (semitone === 6) offsetFactor = 0.38; // F#
          else if (semitone === 8) offsetFactor = 0.50; // G#
          else if (semitone === 10) offsetFactor = 0.62;// A#

          k.x = prevWhite.x + prevWhite.width * offsetFactor - (blackKeyWidth * 0.5);
          k.y = topY;
          k.width = blackKeyWidth;
          k.height = blackKeyHeight;
        } else {
          // Fallback if black key is very first key
          k.x = 0;
          k.y = topY;
          k.width = blackKeyWidth;
          k.height = blackKeyHeight;
        }
      }
    });
  }

  getKey(midiNote) {
    return this.keys.find(k => k.midi === midiNote) || null;
  }

  getKeyAt(px, py, width, height, keyboardHeight) {
    const topY = height - keyboardHeight;
    if (py < topY || py > height) return null;

    // Check black keys first (since they sit on top of white keys)
    for (let i = 0; i < this.keys.length; i++) {
      const k = this.keys[i];
      if (k.isBlack && px >= k.x && px <= k.x + k.width && py >= k.y && py <= k.y + k.height) {
        return k;
      }
    }

    // Check white keys
    for (let i = 0; i < this.keys.length; i++) {
      const k = this.keys[i];
      if (!k.isBlack && px >= k.x && px <= k.x + k.width && py >= k.y && py <= k.y + k.height) {
        return k;
      }
    }

    return null;
  }

  setNoteState(midiNote, active, options = {}) {
    if (active) {
      this.activeKeys.set(midiNote, {
        color: options.color || '#00e5ff',
        velocity: options.velocity || 0.8,
        isUser: !!options.isUser,
        isSong: !!options.isSong,
        timestamp: performance.now()
      });
    } else {
      this.activeKeys.delete(midiNote);
    }
  }

  isNoteActive(midiNote) {
    return this.activeKeys.has(midiNote);
  }

  getActiveKeyData(midiNote) {
    return this.activeKeys.get(midiNote);
  }

  clearActiveKeys() {
    this.activeKeys.clear();
  }

  /**
   * Draw the 3D visual piano keyboard onto the canvas context
   */
  render(ctx, width, height, keyboardHeight) {
    const topY = height - keyboardHeight;

    // Keyboard backplate / felt strip at the very top (acoustic piano signature crimson felt)
    ctx.fillStyle = '#111317';
    ctx.fillRect(0, topY - 6, width, keyboardHeight + 6);

    ctx.fillStyle = '#b71c1c'; // Crimson piano felt
    ctx.fillRect(0, topY - 3, width, 4);

    // Subtle felt highlight
    ctx.fillStyle = 'rgba(255, 100, 100, 0.4)';
    ctx.fillRect(0, topY - 3, width, 1);

    // 1. Draw all WHITE keys first
    this.keys.forEach(k => {
      if (!k.isBlack) {
        this.renderWhiteKey(ctx, k);
      }
    });

    // 2. Draw all BLACK keys on top
    this.keys.forEach(k => {
      if (k.isBlack) {
        this.renderBlackKey(ctx, k);
      }
    });
  }

  renderWhiteKey(ctx, key) {
    const active = this.activeKeys.get(key.midi);
    const { x, y, width, height } = key;

    ctx.save();

    if (active) {
      // Pressed White Key
      // Depressed visual: slightly shorter gradient + colored top cap and glow
      const grad = ctx.createLinearGradient(x, y, x, y + height);
      grad.addColorStop(0, '#e0e7ee');
      grad.addColorStop(0.85, '#cfd8dc');
      grad.addColorStop(1, '#b0bec5');
      ctx.fillStyle = grad;
      ctx.fillRect(x + 1, y + 2, width - 2, height - 2);

      // Key depression shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(x + 1, y, width - 2, 4);

      // Radiant glow on pressed key cap
      const activeColor = active.color || '#00e5ff';
      const capGrad = ctx.createLinearGradient(x, y, x, y + height * 0.45);
      capGrad.addColorStop(0, activeColor);
      capGrad.addColorStop(0.5, hexToRgba(activeColor, 0.45));
      capGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = capGrad;
      ctx.fillRect(x + 1, y, width - 2, height * 0.45);

      // Bright impact line at the very top edge
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 1, y, width - 2, 3);
    } else {
      // Normal White Key with 3D ivory gradient
      const grad = ctx.createLinearGradient(x, y, x, y + height);
      grad.addColorStop(0, '#fbfbfb');
      grad.addColorStop(0.7, '#f0f3f6');
      grad.addColorStop(0.95, '#e4e8ec');
      grad.addColorStop(1, '#caced2');

      ctx.fillStyle = grad;
      ctx.fillRect(x + 0.5, y, width - 1, height);

      // Subtle right edge separator bevel
      ctx.fillStyle = '#9e9e9e';
      ctx.fillRect(x + width - 1, y, 1, height);

      // Subtle left edge highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillRect(x + 0.5, y, 1, height);

      // Bottom curved bevel
      ctx.fillStyle = '#828a92';
      ctx.fillRect(x + 1, y + height - 3, width - 2, 3);
    }

    // Note Label
    if (this.showLabels) {
      this.renderKeyLabel(ctx, key, false, active);
    }

    ctx.restore();
  }

  renderBlackKey(ctx, key) {
    const active = this.activeKeys.get(key.midi);
    const { x, y, width, height } = key;

    ctx.save();

    // Drop shadow beneath black key onto white keys
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(x - 2, y, width + 4, height + 4);

    if (active) {
      // Pressed Black Key
      const grad = ctx.createLinearGradient(x, y, x, y + height);
      grad.addColorStop(0, '#222');
      grad.addColorStop(1, '#111');
      ctx.fillStyle = grad;
      ctx.fillRect(x + 1, y + 2, width - 2, height - 2);

      // Glowing color cap
      const activeColor = active.color || '#ff0077';
      const capGrad = ctx.createLinearGradient(x, y, x, y + height * 0.7);
      capGrad.addColorStop(0, activeColor);
      capGrad.addColorStop(0.5, hexToRgba(activeColor, 0.5));
      capGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = capGrad;
      ctx.fillRect(x + 1, y + 2, width - 2, height * 0.6);

      // Top impact highlight
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + 1, y + 2, width - 2, 3);
    } else {
      // Realistic 3D Black Key (Matte Ebony with Bevel)
      const grad = ctx.createLinearGradient(x, y, x, y + height);
      grad.addColorStop(0, '#3a3d42');
      grad.addColorStop(0.15, '#22252a');
      grad.addColorStop(0.85, '#17181c');
      grad.addColorStop(1, '#0e0f11');

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, width, height);

      // Left edge bevel
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fillRect(x, y, 1.5, height);

      // Right edge shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(x + width - 1.5, y, 1.5, height);

      // Bottom step
      ctx.fillStyle = '#0a0a0c';
      ctx.fillRect(x + 1, y + height - 4, width - 2, 4);
    }

    if (this.showLabels && width > 14) {
      this.renderKeyLabel(ctx, key, true, active);
    }

    ctx.restore();
  }

  renderKeyLabel(ctx, key, isBlack, active) {
    if (this.labelMode === 'none') return;
    if (!isBlack && key.width < 12 && key.name !== 'C') return; // Skip non-C labels if keys are extremely narrow

    let text = '';
    if (this.labelMode === 'solfege') {
      const solfege = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];
      text = solfege[key.semitone];
      if (key.semitone === 0) text += key.octave; // show octave on C
    } else {
      // Show note name, with octave number primarily on C notes (C3, C4, C5)
      text = key.name;
      if (key.name === 'C' || key.width > 24) {
        text = key.fullName;
      }
    }

    const fontSize = isBlack 
      ? Math.max(7, Math.min(11, Math.round(key.width * 0.55)))
      : Math.max(8, Math.min(13, Math.round(key.width * 0.46)));
    ctx.font = `bold ${fontSize}px 'Outfit', -apple-system, sans-serif`;
    ctx.textAlign = 'center';

    if (isBlack) {
      ctx.fillStyle = active ? '#ffffff' : 'rgba(255, 255, 255, 0.65)';
      ctx.fillText(text, key.x + key.width / 2, key.y + key.height - 6);
    } else {
      ctx.fillStyle = active ? '#000000' : (key.name === 'C' ? '#00e5ff' : '#6c7a89');
      ctx.fillText(text, key.x + key.width / 2, key.y + key.height - 8);
    }
  }
}

window.PianoKeyboard = PianoKeyboard;
