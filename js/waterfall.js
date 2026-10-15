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
    this.theme = 'classic'; // 'classic', 'rainbow', 'neon', 'gold'
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

    this.initResize();
  }

  initResize() {
    const handleResize = () => {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
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

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => setTimeout(handleResize, 150));
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }
    // Initial call
    setTimeout(handleResize, 20);
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

  getNoteColor(note) {
    if (this.theme === 'rainbow') {
      return this.rainbowPalette[note.pitch % 12];
    } else if (this.theme === 'neon') {
      return (note.channel === 1 || note.pitch < 60) ? '#ff0077' : '#00f0ff';
    } else if (this.theme === 'gold') {
      return (note.channel === 1 || note.pitch < 60) ? '#ffb300' : '#8c52ff';
    } else {
      // Classic Visual Piano: Green for right hand, Blue for left hand
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
    const count = Math.min(24, Math.max(12, Math.floor(width * 0.9)));
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + Math.random() * width,
        y: y - Math.random() * 6,
        vx: (Math.random() - 0.5) * 120,
        vy: -Math.random() * 170 - 60,
        size: Math.random() * 3.8 + 2.0,
        color: Math.random() > 0.35 ? color : '#ffffff',
        type: Math.random() > 0.4 ? 'star' : 'spark',
        life: 1.0,
        decay: Math.random() * 2.2 + 1.2
      });
    }
  }

  spawnSustainedSparkles(x, y, width, color) {
    // Continuous sparkling fountain while note is held/sustaining across its whole length
    const count = Math.random() < 0.75 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + Math.random() * width,
        y: y - Math.random() * 4,
        vx: (Math.random() - 0.5) * 80,
        vy: -Math.random() * 120 - 45,
        size: Math.random() * 3.0 + 1.5,
        color: Math.random() > 0.3 ? color : '#ffffff',
        type: Math.random() > 0.45 ? 'star' : 'spark',
        life: 1.0,
        decay: Math.random() * 2.8 + 1.8
      });
    }
  }

  updateAndRender(now) {
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

    // 3. Draw Laser / Hit Line Glow
    this.drawHitLine(w, hitY);

    // 4. Update & Draw Particles
    this.drawParticles(dt);

    // 5. Draw Piano Keyboard
    this.piano.render(this.ctx, w, h, this.keyboardHeight);
  }

  drawLanes(width, hitY) {
    const ctx = this.ctx;
    ctx.save();

    // Subtle dark gradient background for waterfall area
    const bgGrad = ctx.createLinearGradient(0, 0, 0, hitY);
    bgGrad.addColorStop(0, '#07080b');
    bgGrad.addColorStop(0.8, '#0b0d14');
    bgGrad.addColorStop(1, '#0e111a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, hitY);

    // Vertical key lanes
    this.piano.keys.forEach(k => {
      if (k.isBlack) {
        // Darker shadow lane for black keys
        ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
        ctx.fillRect(k.x, 0, k.width, hitY);
      } else {
        // Very subtle lane separator for white keys
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

    this.notes.forEach(note => {
      const noteEnd = note.startTime + note.duration;
      // Skip notes outside window
      if (noteEnd < windowStart || note.startTime > windowEnd) {
        return;
      }

      const key = this.piano.getKey(note.pitch);
      if (!key) return;

      // Note Y positioning
      // When curTime == note.startTime, bottomY = hitY
      // When curTime > note.startTime and curTime < noteEnd, note is hitting!
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

        // If newly hitting, trigger sound and big burst
        if (!this.activeNotePool.has(note)) {
          this.activeNotePool.add(note);
          if (this.onNoteTrigger) this.onNoteTrigger(note.pitch, note.velocity);
          this.spawnHitParticles(key.x, hitY, key.width, note.color);
        } else {
          // Continuous sparkling fountain while note is held/sustaining across its whole length!
          this.spawnSustainedSparkles(key.x, hitY, key.width, note.color);
        }

        // Draw radiant vertical light energy beam shooting upward from hit line
        const beamHeight = Math.min(180, hitY * 0.45);
        const beamGrad = ctx.createLinearGradient(key.x, hitY, key.x, hitY - beamHeight);
        beamGrad.addColorStop(0, typeof hexToRgba === 'function' ? hexToRgba(note.color, 0.45) : 'rgba(0, 229, 255, 0.45)');
        beamGrad.addColorStop(0.5, typeof hexToRgba === 'function' ? hexToRgba(note.color, 0.15) : 'rgba(0, 229, 255, 0.15)');
        beamGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = beamGrad;
        ctx.fillRect(key.x, hitY - beamHeight, key.width, beamHeight);
      }

      // Visible bounds
      if (topY > hitY || bottomY < 0) return;

      // Clip bottom to hitY if striking
      const renderBottomY = Math.min(hitY, bottomY);
      const renderHeight = Math.max(4, renderBottomY - topY);

      this.renderNoteBar(ctx, key.x + 1, topY, key.width - 2, renderHeight, note.color, isStriking, note);
    });

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

  renderNoteBar(ctx, x, y, width, height, color, isStriking, note) {
    ctx.save();

    const cornerRadius = Math.min(5, Math.min(width / 2, height / 2));

    // Glow aura around note bar (especially intense when striking)
    if (isStriking) {
      ctx.shadowColor = color;
      ctx.shadowBlur = 18;
    } else {
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
    }

    // Gradient fill for 3D rounded pill note
    const grad = ctx.createLinearGradient(x, y, x + width, y);
    grad.addColorStop(0, color);
    grad.addColorStop(0.3, '#ffffff'); // bright sheen
    grad.addColorStop(0.7, color);
    grad.addColorStop(1, '#000000');

    // Rounded rectangle path
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, width, height, [cornerRadius, cornerRadius, 2, 2]);
    } else {
      ctx.rect(x, y, width, height);
    }
    ctx.fillStyle = color;
    ctx.fill();

    // Top glossy highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillRect(x + 1, y, width - 2, Math.min(4, height));

    // Dark edge border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // =========================================================================
    // Flashy Animation 1: Animated Shimmer Wave traveling along note length
    // =========================================================================
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

    // =========================================================================
    // Flashy Animation 2: Sparkling Diamond Stars along the WHOLE length of note
    // =========================================================================
    if (height > 10) {
      const sparkleSpacing = Math.max(16, Math.min(30, height / 4));
      const numSparkles = Math.floor(height / sparkleSpacing);

      for (let s = 0; s < numSparkles; s++) {
        // Hash for deterministic positioning per segment
        const hash = Math.sin(note.pitch * 13.7 + s * 7.9) * 43758.5453;
        const fracX = (hash - Math.floor(hash));
        const sparkleX = x + 3 + fracX * Math.max(1, width - 6);
        const sparkleY = y + s * sparkleSpacing + (sparkleSpacing * 0.5);

        // Twinkle oscillation
        const twinkleFreq = 9.0 + (s % 3) * 3.5;
        const phase = note.pitch * 2.8 + s * 1.9;
        const twinkle = 0.5 + 0.5 * Math.sin(this.currentTime * twinkleFreq + phase);

        // Flash threshold: draw diamond star glint
        if (twinkle > 0.38) {
          const starRadius = (width > 22 ? 4.5 : 3.0) * (0.6 + 0.65 * twinkle);
          const alpha = twinkle * (isStriking ? 1.0 : 0.85);
          this.drawSparkleStar(ctx, sparkleX, sparkleY, starRadius, color, alpha);
        }
      }
    }

    // Extra flashy star flare at bottom impact point when striking
    if (isStriking) {
      const flareSize = (width > 20 ? 8 : 5.5) * (0.8 + 0.3 * Math.sin(this.currentTime * 20));
      this.drawSparkleStar(ctx, x + width / 2, y + height - 2, flareSize, color, 1.0);
    }

    // If key is wide enough, display note name
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
    ctx.save();

    // Radiant hit-line glow where waterfall meets the keys
    const lineGrad = ctx.createLinearGradient(0, hitY - 4, 0, hitY + 2);
    lineGrad.addColorStop(0, 'rgba(0, 229, 255, 0)');
    lineGrad.addColorStop(0.7, 'rgba(0, 229, 255, 0.45)');
    lineGrad.addColorStop(1, 'rgba(255, 255, 255, 0.85)');

    ctx.fillStyle = lineGrad;
    ctx.fillRect(0, hitY - 4, width, 5);

    // Laser thin beam
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, hitY - 1, width, 1.5);

    ctx.restore();
  }

  drawParticles(dt) {
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
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();

        // White hot center
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
