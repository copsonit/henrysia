# Henrysia Project Instructions

## Purpose
Henrysia is a high-performance visual piano waterfall and pattern player built with HTML5 Canvas and the Web Audio API, designed for children (Henry) to learn numbers, letters, names, and music patterns on tablets and desktop browsers.

- **Stack**: Vanilla HTML5, Canvas 2D, Web Audio API, Zero-dependency Node.js server.
- **Hosting**: Azure Static Web Apps (`proud-sand-0b1b0d710.azurestaticapps.net`) and optional Azure Function HTTP server.
- **MIDI**: Pure JS binary format 0/1 encoder (`midi-writer.js`) and decoder (`midi-parser.js`).

---

## ðŸŽ¨ Architectural Principles & Guidelines

### 1. Tablet & Mobile Performance (Mi Pad SE & iPads)
- **High-DPI Fill-Rate Clamping**: Always clamp `devicePixelRatio` to prevent 4x fill-rate bottlenecks on 2K/retina screens:
  - Low (30 FPS): DPR 1.0, 0 shadow blur, 0 particles.
  - Medium (60 FPS): DPR 1.25, 20 max particles, lightweight blur.
  - High (Uncapped): DPR 2.0, full particle bursts, ultra glow.
- **Zero-Allocation 60 FPS Render Loop**: Never instantiate `new Path2D()`, gradients, or closures inside `requestAnimationFrame`. Reuse cached color palettes.
- **Binary Search Note Windowing**: Notes must be sorted by `startTime` and filtered via binary search to look up the active time slice in `O(log N + visible)` instead of `O(N)` linear array iteration.

### 2. Audio Engine Guidelines
- Built on Web Audio API physical modeling (fundamental + inharmonic partials + hammer noise).
- Budget device safeguard: Bypass convolver impulse reverb in Low/Medium modes to prevent audio thread dropouts.
- Implement polyphony voice stealing to limit concurrent active oscillators.
- Always resume `AudioContext` on first user gesture.

### 3. Musical Diatonic Mapping
- Default to **C Major (White Keys Only)** for pattern generation (numbers, letters) to produce sweet, harmonious chords and avoid dissonant accidental collisions for young learners.
