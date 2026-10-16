- [x] **Better use of the keyboard**: Use all 88 keys to fit long texts without cutoff, center all text lines across the piano, and support multi-line cascade (e.g. HAPPY on line 1, BIRTHDAY on line 2).

- [x] **Make a Halloween theme**: Spooky Halloween visual palette (Pumpkin Orange, Witch Purple, Slime Green, Blood Red) and haunted theme song in library.

- [x] **Color scheme**: Inactive keys are sleek grey slate-ivory from the start; each key illuminates along its entire length with the exact color of the character/number striking it.

- [x] **Character color**: Rainbow scheme for numbers 0-9 matching the Synthesia photo (0: Coral Pink, 1: Golden Yellow, 2: Bright Green, 7: Lime Green, etc.) and unique vibrant colors for each letter A-Z.

- [x] **Fonts**: Authentic retro video game pixel fonts for falling notes matching the user's photo (clean 0, hooked 1, curved 2, retro 7) plus Google Fonts Silkscreen & Press Start 2P in UI.

- [x] **1 to 100,000 Number Stream**: Added preset in Song Library and Custom Pattern modal featuring the iconic 10,720 cascade shown in the photo.

- [x] **C Major & White Keys Only**: Default musical scale and visual key mapping set to C Major using only the 52 white keys for a pure, sweet diatonic harmony with no clashing black keys. UI settings selector added to Desktop controls, Custom Pattern creator, and Settings drawer.

- [x] **Small Tablet & Budget Device Optimization (Mi Pad SE)**:
  - Added Fidelity / Performance selector (**Low 30Hz**, **Medium 60Hz**, **High Ultra Glow**) with automatic tablet detection.
  - **Low Mode**: Capped at 30Hz update, clamped DPR to 1.0 (eliminates 4x retina fill-rate overhead), 0 shadow blur passes, 0 gradient allocations per frame.
  - **High-Performance Audio**: Lightweight 1-oscillator warm piano synth, convolver reverb bypass, and strict polyphony voice stealing on budget tablets.
  - **Binary Search Viewport Windowing**: Replaced O(N) linear scanning of thousands of notes with binary-searched time-window lookup O(log N + visible).

- [x] **Particle effects & low-end performance**: Particles completely disabled in Low mode to eliminate draw calls and memory churn; capped to 20 lightweight particles in Medium mode.



