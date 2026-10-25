/**
 * Henrysia Waterfall Visualizer Engine
 * 60 FPS HTML5 Canvas rendering of falling notes, lane guides,
 * glowing impact line, and particle bursts.
 */

class WaterfallEngine {
  constructor(canvas, piano) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.piano = piano;

    // Viewport & dimensions
    this.width = canvas.width;
    this.height = canvas.height;
    this.keyboardHeight = 140;

    // Playback state
    this.notes = []; // array of { pitch, startTime, duration, velocity, channel, color }
    this.currentTime = 0; // seconds
    this.speed = 280; // pixels per second
    this.isPlaying = false;
    this.playbackRate = 1.0;
    this.lastFrameTime = performance.now();

    // Theme & styling
    this.theme = 'gemRainbow'; // 'gemRainbow', 'character', 'halloween', 'classic', 'rainbow', 'neon', 'gold'
    this.particles = [];
    this.activeNotePool = new Set();

    // Handlers
    this.onNoteTrigger = null;
    this.onNoteRelease = null;
    this.onSongEnd = null;

    // Pre-calculate color palettes
    this.rainbowPalette = [
      '#ff3b30', '#ff9500', '#ffcc00', '#34c759',
      '#00c7be', '#30b0c7', '#007aff', '#5856d6',
      '#af52de', '#ff2d55', '#ff6482', '#ff85a2'
    ];

    this.halloweenPalette = [
      '#ff7518', // Pumpkin Orange
      '#a855f7', // Witch Purple
      '#22c55e', // Slime Green
      '#ef4444', // Blood Red
      '#ff9f1c', // Jack-o-lantern Amber
      '#ec4899'  // Ghostly Pink
    ];

    // Fidelity & Performance: 'low' (30Hz tablet), 'medium' (60Hz balanced), 'high' (ultra)
    this.fidelity = 'medium';
    this.targetFps = 60;
    this.frameInterval = 1000 / 60;
    this.lastFrameTimestamp = 0;

    this.initResize();
  }

  setFidelity(fidelity = 'medium') {
    this.fidelity = fidelity;
    if (fidelity === 'low') {
      this.targetFps = 30;
      this.frameInterval = 1000 / 30;
      this.particles = [];
    } else if (fidelity === 'medium') {
      this.targetFps = 60;
      this.frameInterval = 1000 / 60;
      if (this.particles.length > 25) this.particles.length = 25;
    } else {
      this.targetFps = 0; // Unclamped (runs at display refresh rate)
      this.frameInterval = 0;
    }

    if (this.piano && typeof this.piano.setFidelity === 'function') {
      this.piano.setFidelity(fidelity);
    }

    if (typeof this.handleResize === 'function') {
      this.handleResize();
    }
  }

  initResize() {
    this.handleResize = () => {
      const rect = this.canvas.getBoundingClientRect();
      let maxDpr = 2.0;
      if (this.fidelity === 'low') maxDpr = 1.0;
      else if (this.fidelity === 'medium') maxDpr = 1.25;

      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      this.canvas.width = Math.round(rect.width * dpr);
      this.canvas.height = Math.round(rect.height * dpr);
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.ctx.resetTransform();
      this.ctx.scale(dpr, dpr);

      this.cssWidth = rect.width;
      this.cssHeight = rect.height;

      // Adaptive keyboard height for mobile & tablet
      const isPortrait = rect.height > rect.width;
      if (isPortrait) {
        this.keyboardHeight = Math.min(170, Math.max(110, Math.round(rect.height * 0.22)));
      } else if (rect.height < 520) {
        this.keyboardHeight = Math.min(130, Math.max(85, Math.round(rect.height * 0.30)));
      } else if (rect.height < 760) {
        this.keyboardHeight = Math.min(150, Math.max(95, Math.round(rect.height * 0.27)));
      } else {
        this.keyboardHeight = Math.min(180, Math.max(110, Math.round(rect.height * 0.24)));
      }

      this.piano.updateLayout(this.cssWidth, this.cssHeight, this.keyboardHeight);
    };

    window.addEventListener('resize', this.handleResize);
    window.addEventListener('orientationchange', () => setTimeout(this.handleResize, 150));
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', this.handleResize);
    }
    // Initial call
    setTimeout(this.handleResize, 20);
  }

  setTheme(themeName) {
    this.theme = themeName;
    this.assignNoteColors();
  }

  setNotes(notesList) {
    this.notes = notesList.slice().sort((a, b) => a.startTime - b.startTime);
    this.assignNoteColors();
    this.currentTime = 0;
    this.piano.clearActiveKeys();
    this.particles = [];
    this.activeNotePool.clear();
  }

  getRainbowColorForX(x) {
    const w = this.cssWidth || (this.canvas ? this.canvas.width : 800) || 800;
    const t = Math.max(0, Math.min(1, x / w));
    const hue = Math.round(18 + t * 267); // 18° (orange/amber) to 285° (purple/magenta)
    return window.hslToHex ? window.hslToHex(hue, 100, 52) : `hsl(${hue}, 100%, 52%)`;
  }

  getNoteColor(note) {
    if (this.theme === 'gemRainbow') {
      if (this.piano) {
        const key = this.piano.getKey(note.pitch);
        if (key && (key.x !== undefined || key.width !== undefined)) {
          return this.getRainbowColorForX(key.x + (key.width || 10) * 0.5);
        }
      }
      if (note.color && note.color.startsWith('#')) return note.color;
      const t = Math.max(0, Math.min(1, (note.pitch - 21) / 87));
      const hue = Math.round(18 + t * 267);
      return window.hslToHex ? window.hslToHex(hue, 100, 52) : `hsl(${hue}, 100%, 52%)`;
    } else if (this.theme === 'character') {
      // Character Color Mode: Rainbow for 0-9 & unique color for letters A-Z
      if (note.charColor) return note.charColor;
      if (note.color) return note.color;
      return this.rainbowPalette[note.pitch % 12];
    } else if (this.theme === 'halloween') {
      // Spooky Halloween Mode
      return this.halloweenPalette[(note.pitch + (note.channel || 0)) % this.halloweenPalette.length];
    } else if (this.theme === 'rainbow') {
      if (note.charColor) return note.charColor;
      return this.rainbowPalette[note.pitch % 12];
    } else if (this.theme === 'neon') {
      return (note.channel === 1 || note.pitch < 60) ? '#ff0077' : '#00f0ff';
    } else if (this.theme === 'gold') {
      return (note.channel === 1 || note.pitch < 60) ? '#ffb300' : '#8c52ff';
    } else {
      // Classic Visual Piano
      if (note.charColor) return note.charColor;
      if (note.channel === 1 || note.pitch < 60) {
        return '#00b0ff'; // Sapphire Blue
      }
      return '#00e676';   // Emerald Green
    }
  }

  assignNoteColors() {
    this.notes.forEach(note => {
      note.color = this.getNoteColor(note);
    });
  }

  getSongDuration() {
    if (!this.notes || this.notes.length === 0) return 0;
    let maxEnd = 0;
    this.notes.forEach(n => {
      const end = n.startTime + n.duration;
      if (end > maxEnd) maxEnd = end;
    });
    return maxEnd + 1.5; // slight padding at end
  }

  setTime(timeInSeconds) {
    this.currentTime = Math.max(0, timeInSeconds);
    // Release any notes currently active
    this.activeNotePool.forEach(n => {
      if (this.onNoteRelease) this.onNoteRelease(n.pitch);
      this.piano.setNoteState(n.pitch, false);
    });
    this.activeNotePool.clear();
  }

  play() {
    this.isPlaying = true;
    this.lastFrameTime = performance.now();
  }

  pause() {
    this.isPlaying = false;
    this.piano.clearActiveKeys();
    this.activeNotePool.forEach(n => {
      if (this.onNoteRelease) this.onNoteRelease(n.pitch);
    });
    this.activeNotePool.clear();
  }

  drawSparkleStar(ctx, cx, cy, radius, color, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = color || '#00e5ff';
    ctx.shadowBlur = 8;

    // 4-pointed diamond star
    ctx.beginPath();
    const inner = radius * 0.22;
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const outerX = cx + Math.cos(angle) * radius;
      const outerY = cy + Math.sin(angle) * radius;
      const nextAngle = angle + Math.PI / 4;
      const innerX = cx + Math.cos(nextAngle) * inner;
      const innerY = cy + Math.sin(nextAngle) * inner;

      if (i === 0) ctx.moveTo(outerX, outerY);
      else ctx.lineTo(outerX, outerY);
      ctx.lineTo(innerX, innerY);
    }
    ctx.closePath();
    ctx.fill();

    // Soft colored halo
    ctx.fillStyle = color || '#00e5ff';
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1, radius * 0.35), 0, Math.PI * 2);
    ctx.fill();

    // Bright center core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(0.7, radius * 0.18), 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  spawnHitParticles(x, y, width, color) {
    if (this.fidelity === 'low') return; // Zero particle overhead in Low fidelity
    const maxAllowed = this.fidelity === 'medium' ? 20 : 80;
    if (this.particles.length >= maxAllowed) return;

    const count = this.fidelity === 'medium' ? 2 : Math.min(12, Math.max(6, Math.floor(width * 0.5)));
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + Math.random() * width,
        y: y - Math.random() * 4,
        vx: (Math.random() - 0.5) * 100,
        vy: -Math.random() * 140 - 50,
        size: Math.random() * 3.0 + 1.5,
        color: Math.random() > 0.35 ? color : '#ffffff',
        type: Math.random() > 0.4 ? 'star' : 'spark',
        life: 1.0,
        decay: Math.random() * 2.2 + 1.4
      });
    }
  }

  spawnSustainedSparkles(x, y, width, color) {
    // Only sustained sparkles on High fidelity to save GPU/CPU cycles
    if (this.fidelity !== 'high') return;
    if (this.particles.length >= 60) return;

    const count = Math.random() < 0.6 ? 1 : 0;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + Math.random() * width,
        y: y - Math.random() * 4,
        vx: (Math.random() - 0.5) * 60,
        vy: -Math.random() * 100 - 40,
        size: Math.random() * 2.5 + 1.2,
        color: Math.random() > 0.3 ? color : '#ffffff',
        type: 'spark',
        life: 1.0,
        decay: Math.random() * 3.0 + 2.0
      });
    }
  }

  updateAndRender(now) {
    // Frame pacing / rate limiting (e.g. 30 FPS in Low mode for tablets like Mi Pad SE)
    if (this.targetFps > 0 && this.frameInterval > 0) {
      const elapsed = now - this.lastFrameTimestamp;
      if (elapsed < this.frameInterval - 1.5) {
        return; // Throttle to target FPS
      }
      this.lastFrameTimestamp = now - (elapsed % this.frameInterval);
    }

    const dt = Math.min(0.1, (now - this.lastFrameTime) / 1000);
    this.lastFrameTime = now;

    if (this.isPlaying) {
      this.currentTime += dt * this.playbackRate;

      const songDuration = this.getSongDuration();
      if (songDuration > 0 && this.currentTime > songDuration) {
        this.pause();
        this.currentTime = 0;
        if (this.onSongEnd) this.onSongEnd();
      }
    }

    const w = this.cssWidth || this.canvas.width;
    const h = this.cssHeight || this.canvas.height;
    const hitY = h - this.keyboardHeight;

    // Clear frame
    this.ctx.fillStyle = '#0a0c10';
    this.ctx.fillRect(0, 0, w, h);

    // 1. Draw Lane Guides
    this.drawLanes(w, hitY);

    // 2. Draw Falling Notes & check active triggers
    this.drawNotes(hitY, dt);

    // 3. Draw Piano Keyboard
    this.piano.render(this.ctx, w, h, this.keyboardHeight);

    // 4. Draw Laser / Electric Rainbow Hit Wave (over keys and felt)
    this.drawHitLine(w, hitY);

    // 5. Update & Draw Particles (floating above keyboard)
    if (this.fidelity !== 'low') {
      this.drawParticles(dt);
    }
  }

  drawLanes(width, hitY) {
    const ctx = this.ctx;
    ctx.save();

    if (this.fidelity === 'low') {
      // Fast solid background on Low fidelity (avoids linear gradient overhead per frame)
      ctx.fillStyle = '#0a0d14';
      ctx.fillRect(0, 0, width, hitY);
    } else {
      // Subtle dark gradient background for waterfall area
      const bgGrad = ctx.createLinearGradient(0, 0, 0, hitY);
      bgGrad.addColorStop(0, '#07080b');
      bgGrad.addColorStop(0.8, '#0b0d14');
      bgGrad.addColorStop(1, '#0e111a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, hitY);
    }

    // Vertical key lanes
    this.piano.keys.forEach(k => {
      if (k.isBlack) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.fillRect(k.x, 0, k.width, hitY);
      } else {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
        ctx.fillRect(k.x + k.width - 1, 0, 1, hitY);
      }
    });

    ctx.restore();
  }

  drawNotes(hitY, dt) {
    const ctx = this.ctx;
    const curTime = this.currentTime;
    const speed = this.speed;

    // Viewport time window
    const lookAheadSec = hitY / speed;
    const windowStart = curTime - 0.5;
    const windowEnd = curTime + lookAheadSec + 0.5;

    const currentFrameActivePitches = new Set();

    // =========================================================================
    // HIGH-PERFORMANCE BINARY SEARCH TIME-WINDOW NOTE SELECTION
    // Eliminates scanning thousands of off-screen notes every single frame!
    // =========================================================================
    let low = 0;
    let high = this.notes.length - 1;
    let startIdx = 0;
    while (low <= high) {
      const mid = (low + high) >> 1;
      const n = this.notes[mid];
      if (n.startTime + (n.duration || 1) < windowStart) {
        startIdx = mid + 1;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    startIdx = Math.max(0, Math.min(startIdx, this.notes.length - 1));

    for (let i = startIdx; i < this.notes.length; i++) {
      const note = this.notes[i];
      // Since notes are sorted by startTime, we can break as soon as startTime > windowEnd
      if (note.startTime > windowEnd) {
        break;
      }

      const noteEnd = note.startTime + note.duration;
      if (noteEnd < windowStart) continue;

      const key = this.piano.getKey(note.pitch);
      if (!key) continue;

      const timeUntilStart = note.startTime - curTime;
      const noteHeight = Math.max(6, note.duration * speed);
      const bottomY = hitY - timeUntilStart * speed;
      const topY = bottomY - noteHeight;

      // Check if note is currently striking keyboard
      const isStriking = (curTime >= note.startTime && curTime <= noteEnd);

      if (isStriking && this.isPlaying) {
        currentFrameActivePitches.add(note.pitch);
        this.piano.setNoteState(note.pitch, true, {
          color: note.color,
          velocity: note.velocity,
          isSong: true
        });

        // Trigger note audio & particles
        if (!this.activeNotePool.has(note)) {
          this.activeNotePool.add(note);
          if (this.onNoteTrigger) this.onNoteTrigger(note.pitch, note.velocity);
          this.spawnHitParticles(key.x, hitY, key.width, note.color);
        } else {
          this.spawnSustainedSparkles(key.x, hitY, key.width, note.color);
        }

        // Draw light beam if in Medium or High fidelity
        if (this.fidelity !== 'low') {
          const beamHeight = Math.min(160, hitY * 0.4);
          const beamGrad = ctx.createLinearGradient(key.x, hitY, key.x, hitY - beamHeight);
          beamGrad.addColorStop(0, typeof hexToRgba === 'function' ? hexToRgba(note.color, 0.4) : 'rgba(0, 229, 255, 0.4)');
          beamGrad.addColorStop(0.5, typeof hexToRgba === 'function' ? hexToRgba(note.color, 0.12) : 'rgba(0, 229, 255, 0.12)');
          beamGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = beamGrad;
          ctx.fillRect(key.x, hitY - beamHeight, key.width, beamHeight);
        }
      }

      // Visible bounds check
      if (topY > hitY || bottomY < 0) continue;

      // Clip bottom to hitY if striking
      const renderBottomY = Math.min(hitY, bottomY);
      const renderHeight = Math.max(4, renderBottomY - topY);

      this.renderNoteBar(ctx, key.x + 1, topY, key.width - 2, renderHeight, note.color, isStriking, note);
    }

    // Check notes that finished striking
    this.activeNotePool.forEach(note => {
      const noteEnd = note.startTime + note.duration;
      if (curTime > noteEnd || !this.isPlaying) {
        this.activeNotePool.delete(note);
        if (this.onNoteRelease) this.onNoteRelease(note.pitch);
        if (!currentFrameActivePitches.has(note.pitch)) {
          this.piano.setNoteState(note.pitch, false);
        }
      }
    });
  }

  renderGemNote(ctx, insetX, insetY, renderW, renderH, color, isStriking, note, isLow, isMed) {
    if (isLow) {
      ctx.fillStyle = color;
      ctx.fillRect(insetX, insetY, renderW, renderH);

      ctx.fillStyle = isStriking ? '#ffffff' : 'rgba(255, 255, 255, 0.45)';
      ctx.fillRect(insetX + 1, insetY, Math.max(1, renderW - 2), Math.min(3, renderH * 0.35));

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.lineWidth = 1;
      ctx.strokeRect(insetX, insetY, renderW, renderH);
      return;
    }

    ctx.save();
    if (isStriking) {
      ctx.shadowColor = color;
      ctx.shadowBlur = isMed ? 10 : 20;
    }

    const isStem = (note && note.isStem) || (renderH >= renderW * 1.8);

    if (isStem) {
      // 3D Illuminated Capsule Tube (for vertical stems like 1, 4, 9)
      const r = Math.min(renderW * 0.45, 5);
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(insetX, insetY, renderW, renderH, r);
      else ctx.rect(insetX, insetY, renderW, renderH);
      ctx.fillStyle = color;
      ctx.fill();

      // Cylindrical specular tube reflection running down the length
      const tube = ctx.createLinearGradient(insetX, insetY, insetX + renderW, insetY);
      tube.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
      tube.addColorStop(0.28, isStriking ? 'rgba(255, 255, 255, 0.78)' : 'rgba(255, 255, 255, 0.58)');
      tube.addColorStop(0.5, isStriking ? 'rgba(255, 255, 255, 0.90)' : 'rgba(255, 255, 255, 0.68)');
      tube.addColorStop(0.72, 'rgba(255, 255, 255, 0.28)');
      tube.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
      ctx.fillStyle = tube;
      ctx.fill();

      // Crisp outer border
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.lineWidth = 1;
      ctx.stroke();

      if (isStriking) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(insetX + 1, insetY + renderH - 3, renderW - 2, 3);
      }
    } else {
      // 3D Beveled Cushion / Pillow Gem Block (for diagonals, curves, and chords)
      const r = Math.min(4.5, Math.min(renderW * 0.32, renderH * 0.32));
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(insetX, insetY, renderW, renderH, r);
      else ctx.rect(insetX, insetY, renderW, renderH);
      ctx.fillStyle = color;
      ctx.fill();

      // Inset 3D cushion bevel (top-left highlight to bottom-right shadow)
      const bevel = ctx.createLinearGradient(insetX, insetY, insetX + renderW, insetY + renderH);
      bevel.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      bevel.addColorStop(0.35, 'rgba(255, 255, 255, 0.15)');
      bevel.addColorStop(0.65, 'rgba(0, 0, 0, 0.08)');
      bevel.addColorStop(1, 'rgba(0, 0, 0, 0.48)');
      ctx.fillStyle = bevel;
      ctx.fill();

      // Specular gloss dome across top third
      const glossH = Math.max(2, Math.min(renderH * 0.42, 6));
      const glossGrad = ctx.createLinearGradient(insetX, insetY, insetX, insetY + glossH);
      glossGrad.addColorStop(0, isStriking ? 'rgba(255, 255, 255, 0.88)' : 'rgba(255, 255, 255, 0.68)');
      glossGrad.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
      ctx.fillStyle = glossGrad;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(insetX + 1.2, insetY + 1.2, renderW - 2.4, glossH, Math.max(1, r - 1));
      else ctx.rect(insetX + 1.2, insetY + 1.2, renderW - 2.4, glossH);
      ctx.fill();

      // Crisp outer gem boundary
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.48)';
      ctx.lineWidth = 1;
      ctx.stroke();

      if (isStriking) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(insetX + 1, insetY + renderH - 2.5, renderW - 2, 2.5);
      }
    }

    // Clean look: NO TEXT inside the gem pixels!
    ctx.restore();
  }

  renderNoteBar(ctx, x, y, width, height, color, isStriking, note) {
    const isLow = this.fidelity === 'low';
    const isMed = this.fidelity === 'medium';

    const insetX = x + 0.5;
    const insetY = y + 0.5;
    const renderW = Math.max(3, width - 1);
    const renderH = Math.max(3, height - 1);

    // Dedicated 3D Gem Shading Path (PianoBit Aesthetic)
    if (this.theme === 'gemRainbow' || (note && note.isGem)) {
      this.renderGemNote(ctx, insetX, insetY, renderW, renderH, color, isStriking, note, isLow, isMed);
      return;
    }

    // =========================================================================
    // LOW FIDELITY: ULTRA-FAST SOLID RETRO ARCADE BLOCK
    // Zero shadow blur, zero gradient allocations, zero canvas state pushes
    // =========================================================================
    if (isLow) {
      ctx.fillStyle = color;
      ctx.fillRect(insetX, insetY, renderW, renderH);

      // Simple glossy top highlight
      ctx.fillStyle = isStriking ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
      ctx.fillRect(insetX + 1, insetY, Math.max(1, renderW - 2), Math.min(3, renderH * 0.35));

      // Crisp arcade tile border
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(insetX, insetY, renderW, renderH);

      // Striking indicator border
      if (isStriking) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(insetX, insetY, renderW, renderH);
      }
      return;
    }

    // =========================================================================
    // MEDIUM & HIGH FIDELITY
    // =========================================================================
    ctx.save();
    const cornerRadius = Math.min(4, Math.min(renderW * 0.35, renderH * 0.35));

    // Glow aura: Moderate blur on Medium, full blur on High
    if (isMed) {
      if (isStriking) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
      }
    } else {
      ctx.shadowColor = color;
      ctx.shadowBlur = isStriking ? 18 : 5;
    }

    // Rounded rectangle path for arcade block note
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(insetX, insetY, renderW, renderH, cornerRadius);
    } else {
      ctx.rect(insetX, insetY, renderW, renderH);
    }
    ctx.fillStyle = color;
    ctx.fill();

    // Top glossy highlight
    ctx.fillStyle = isStriking ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.38)';
    ctx.fillRect(insetX + 1, insetY, renderW - 2, Math.min(3, renderH * 0.35));

    // Crisp arcade tile border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Shimmer waves and sparkles on High fidelity only
    if (!isMed && height > 24) {
      const shimmerCycle = ((this.currentTime * 320 + note.pitch * 25) % (height + 70)) - 35;
      if (shimmerCycle > -25 && shimmerCycle < height + 25) {
        const shimmerY = y + shimmerCycle;
        const sGrad = ctx.createLinearGradient(x, shimmerY - 18, x, shimmerY + 18);
        sGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        sGrad.addColorStop(0.5, isStriking ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.5)');
        sGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = sGrad;
        const startClamped = Math.max(y, shimmerY - 18);
        const endClamped = Math.min(y + height, shimmerY + 18);
        if (endClamped > startClamped) {
          ctx.fillRect(x + 1, startClamped, width - 2, endClamped - startClamped);
        }
      }
    }

    if (!isMed && height > 16) {
      const sparkleSpacing = Math.max(20, Math.min(36, height / 3));
      const numSparkles = Math.floor(height / sparkleSpacing);

      for (let s = 0; s < numSparkles; s++) {
        const hash = Math.sin(note.pitch * 13.7 + s * 7.9) * 43758.5453;
        const fracX = (hash - Math.floor(hash));
        const sparkleX = x + 3 + fracX * Math.max(1, width - 6);
        const sparkleY = y + s * sparkleSpacing + (sparkleSpacing * 0.5);

        const twinkleFreq = 9.0 + (s % 3) * 3.5;
        const phase = note.pitch * 2.8 + s * 1.9;
        const twinkle = 0.5 + 0.5 * Math.sin(this.currentTime * twinkleFreq + phase);

        if (twinkle > 0.45) {
          const starRadius = (width > 22 ? 4.0 : 2.5) * (0.6 + 0.65 * twinkle);
          const alpha = twinkle * (isStriking ? 1.0 : 0.85);
          this.drawSparkleStar(ctx, sparkleX, sparkleY, starRadius, color, alpha);
        }
      }
    }

    // Extra star flare when striking
    if (isStriking && !isMed) {
      const flareSize = (width > 20 ? 8 : 5.5) * (0.8 + 0.3 * Math.sin(this.currentTime * 20));
      this.drawSparkleStar(ctx, x + width / 2, y + height - 2, flareSize, color, 1.0);
    }

    // Display note name if wide enough
    if (width > 24 && height > 16) {
      ctx.fillStyle = '#0a0c10';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      const key = this.piano.getKey(note.pitch);
      if (key) {
        ctx.fillText(key.name, x + width / 2, y + height - 5);
      }
    }

    ctx.restore();
  }

  drawHitLine(width, hitY) {
    const ctx = this.ctx;

    if (this.fidelity === 'low') {
      // Solid fast 1px hit line (no gradient)
      ctx.fillStyle = '#00e5ff';
      ctx.fillRect(0, hitY - 1, width, 1.5);
      return;
    }

    ctx.save();
    if (this.theme === 'gemRainbow') {
      // Electric Rainbow Plasma Wave (Authentic PianoBit Aesthetic)
      const curTime = this.currentTime;
      const waveGrad = ctx.createLinearGradient(0, 0, width, 0);
      waveGrad.addColorStop(0, '#ff4500');   // Warm orange
      waveGrad.addColorStop(0.2, '#ffd700'); // Gold
      waveGrad.addColorStop(0.45, '#00e676');// Emerald
      waveGrad.addColorStop(0.7, '#00e5ff'); // Cyan
      waveGrad.addColorStop(0.88, '#3d5afe');// Cobalt
      waveGrad.addColorStop(1, '#d500f9');   // Purple/magenta

      // Ambient outer colored glow
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = this.fidelity === 'high' ? 14 : 7;
      ctx.strokeStyle = waveGrad;
      ctx.lineWidth = 3.2;

      ctx.beginPath();
      const step = 8;
      for (let x = 0; x <= width; x += step) {
        // Multi-frequency undulation for electric energy spark effect
        const dy = Math.sin(x * 0.045 + curTime * 7.5) * 1.8 + Math.cos(x * 0.11 - curTime * 11) * 1.1;
        if (x === 0) ctx.moveTo(x, hitY + dy);
        else ctx.lineTo(x, hitY + dy);
      }
      ctx.stroke();

      // Hot white electric plasma core
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#ffffff';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    } else {
      const lineGrad = ctx.createLinearGradient(0, hitY - 4, 0, hitY + 2);
      lineGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
      lineGrad.addColorStop(0.7, 'rgba(0, 229, 255, 0.45)');
      lineGrad.addColorStop(1, 'rgba(255, 255, 255, 0.85)');

      ctx.fillStyle = lineGrad;
      ctx.fillRect(0, hitY - 4, width, 5);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, hitY - 1, width, 1.5);
    }
    ctx.restore();
  }

  drawParticles(dt) {
    if (this.fidelity === 'low' || this.particles.length === 0) return;
    const ctx = this.ctx;
    ctx.save();

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= p.decay * dt;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      const alpha = Math.max(0, p.life);

      if (p.type === 'star') {
        this.drawSparkleStar(ctx, p.x, p.y, p.size * (0.8 + 0.4 * p.life), p.color, alpha);
      } else {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();

        // White center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, (p.size * alpha) * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}

window.WaterfallEngine = WaterfallEngine;
