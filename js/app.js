/**
 * Henrysia Main Application Controller
 * Handles user interactions, audio triggering, file drag-and-drop,
 * pattern creation, and MIDI export.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Instantiate Core Subsystems
  const canvas = document.getElementById('waterfallCanvas');
  const piano = new PianoKeyboard({
    minMidi: 21,
    maxMidi: 108
  });
  const waterfall = new WaterfallEngine(canvas, piano);
  const audio = window.PianoAudio;

  // Sound triggers from waterfall hitting piano keys
  waterfall.onNoteTrigger = (pitch, velocity) => {
    audio.playNote(pitch, velocity);
  };
  waterfall.onNoteRelease = (pitch) => {
    audio.stopNote(pitch);
  };
  waterfall.onSongEnd = () => {
    updatePlayPauseButton();
  };

  // 2. UI Elements
  const playPauseBtn = document.getElementById('playPauseBtn');
  const rewindBtn = document.getElementById('rewindBtn');
  const timelineSlider = document.getElementById('timelineSlider');
  const timeCurrentEl = document.getElementById('timeCurrent');
  const timeTotalEl = document.getElementById('timeTotal');
  const speedSelect = document.getElementById('speedSelect');
  const songSelect = document.getElementById('songSelect');
  const themeSelect = document.getElementById('themeSelect');
  const soundSelect = document.getElementById('soundSelect');
  const rangeSelect = document.getElementById('rangeSelect');
  const labelsSelect = document.getElementById('labelsSelect');
  const scaleSelect = document.getElementById('scaleSelect');
  const fidelitySelect = document.getElementById('fidelitySelect');
  const volumeSlider = document.getElementById('volumeSlider');
  const downloadMidiBtn = document.getElementById('downloadMidiBtn');
  const midiFileInput = document.getElementById('midiFileInput');
  const openCustomModalBtn = document.getElementById('openCustomModalBtn');

  // Custom Pattern Modal Elements
  const customModal = document.getElementById('customModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const customTextInput = document.getElementById('customTextInput');
  const customModeSelect = document.getElementById('customModeSelect');
  const customScaleSelect = document.getElementById('customScaleSelect');
  const applyCustomPatternBtn = document.getElementById('applyCustomPatternBtn');
  const downloadCustomMidiBtn = document.getElementById('downloadCustomMidiBtn');

  // Settings Modal Elements (Tablet & Mobile)
  const settingsModal = document.getElementById('settingsModal');
  const settingsBtn = document.getElementById('settingsBtn');
  const closeSettingsModalBtn = document.getElementById('closeSettingsModalBtn');
  const modalThemeSelect = document.getElementById('modalThemeSelect');
  const modalRangeSelect = document.getElementById('modalRangeSelect');
  const modalSoundSelect = document.getElementById('modalSoundSelect');
  const modalLabelsSelect = document.getElementById('modalLabelsSelect');
  const modalScaleSelect = document.getElementById('modalScaleSelect');
  const modalFidelitySelect = document.getElementById('modalFidelitySelect');
  const modalSpeedSelect = document.getElementById('modalSpeedSelect');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const modalFullscreenBtn = document.getElementById('modalFullscreenBtn');

  // Current Song Metadata
  let currentSongTitle = "Henry's Grand Showcase";
  let currentNotes = [];

  // Populate Song Library in dropdown
  const librarySongs = SongLibrary.getSongs();
  let currentCategory = '';
  let currentOptGroup = null;

  librarySongs.forEach(song => {
    if (song.category !== currentCategory) {
      currentCategory = song.category;
      currentOptGroup = document.createElement('optgroup');
      currentOptGroup.label = currentCategory;
      songSelect.appendChild(currentOptGroup);
    }
    const opt = document.createElement('option');
    opt.value = song.id;
    opt.textContent = song.title;
    currentOptGroup.appendChild(opt);
  });

  // Load a song by ID
  function loadSongById(songId) {
    const song = librarySongs.find(s => s.id === songId);
    if (!song) return;

    currentSongTitle = song.title.replace(/^[^\w\s]+/, '').trim();
    currentNotes = song.getNotes();
    loadNotes(currentNotes, currentSongTitle);
  }

  // Common loader for notes array
  function loadNotes(notes, title) {
    currentNotes = notes;
    waterfall.setNotes(notes);
    if (piano.keyRangePreset === 'auto') {
      piano.setKeyRange('auto', notes);
    }
    updateTimelineUI();
    document.getElementById('currentSongDisplay').textContent = title || 'Custom Song';
  }

  function updateTimelineUI() {
    const total = waterfall.getSongDuration();
    timelineSlider.max = Math.max(1, total);
    timelineSlider.value = waterfall.currentTime;
    timeCurrentEl.textContent = formatTime(waterfall.currentTime);
    timeTotalEl.textContent = formatTime(total);
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function updatePlayPauseButton() {
    if (waterfall.isPlaying) {
      playPauseBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
        <span>Pause</span>
      `;
      playPauseBtn.classList.add('playing');
    } else {
      playPauseBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
        <span>Play</span>
      `;
      playPauseBtn.classList.remove('playing');
    }
  }

  // 3. Event Listeners
  playPauseBtn.addEventListener('click', () => {
    audio.ensureContext();
    if (waterfall.isPlaying) {
      waterfall.pause();
    } else {
      waterfall.play();
    }
    updatePlayPauseButton();
  });

  rewindBtn.addEventListener('click', () => {
    audio.ensureContext();
    waterfall.setTime(0);
    updateTimelineUI();
  });

  timelineSlider.addEventListener('input', (e) => {
    const t = parseFloat(e.target.value);
    waterfall.setTime(t);
    timeCurrentEl.textContent = formatTime(t);
  });

  speedSelect.addEventListener('change', (e) => {
    waterfall.playbackRate = parseFloat(e.target.value);
  });

  songSelect.addEventListener('change', (e) => {
    audio.ensureContext();
    loadSongById(e.target.value);
    waterfall.play();
    updatePlayPauseButton();
  });

  themeSelect.addEventListener('change', (e) => {
    waterfall.setTheme(e.target.value);
  });

  soundSelect.addEventListener('change', (e) => {
    audio.setSoundMode(e.target.value);
  });

  rangeSelect.addEventListener('change', (e) => {
    piano.setKeyRange(e.target.value, currentNotes);
  });

  labelsSelect.addEventListener('change', (e) => {
    piano.labelMode = e.target.value;
  });

  if (scaleSelect) {
    scaleSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (modalScaleSelect) modalScaleSelect.value = val;
      if (customScaleSelect) customScaleSelect.value = val;
    });
  }

  volumeSlider.addEventListener('input', (e) => {
    audio.setVolume(parseFloat(e.target.value));
  });

  // Fullscreen Handlers
  function toggleFullscreen() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      const el = document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);
  if (modalFullscreenBtn) modalFullscreenBtn.addEventListener('click', toggleFullscreen);

  // Settings Modal Toggle & Synchronization
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      if (modalThemeSelect) modalThemeSelect.value = themeSelect.value;
      if (modalRangeSelect) modalRangeSelect.value = rangeSelect.value;
      if (modalSoundSelect) modalSoundSelect.value = soundSelect.value;
      if (modalLabelsSelect) modalLabelsSelect.value = labelsSelect.value;
      if (modalScaleSelect && scaleSelect) modalScaleSelect.value = scaleSelect.value;
      if (modalFidelitySelect && fidelitySelect) modalFidelitySelect.value = fidelitySelect.value;
      if (modalSpeedSelect) modalSpeedSelect.value = speedSelect.value;
      settingsModal.classList.add('active');
    });
  }

  if (closeSettingsModalBtn) {
    closeSettingsModalBtn.addEventListener('click', () => {
      settingsModal.classList.remove('active');
    });
  }

  if (settingsModal) {
    settingsModal.addEventListener('click', (e) => {
      if (e.target === settingsModal) {
        settingsModal.classList.remove('active');
      }
    });
  }

  if (modalThemeSelect) {
    modalThemeSelect.addEventListener('change', (e) => {
      themeSelect.value = e.target.value;
      waterfall.setTheme(e.target.value);
    });
  }
  if (modalRangeSelect) {
    modalRangeSelect.addEventListener('change', (e) => {
      rangeSelect.value = e.target.value;
      piano.setKeyRange(e.target.value, currentNotes);
    });
  }
  if (modalSoundSelect) {
    modalSoundSelect.addEventListener('change', (e) => {
      soundSelect.value = e.target.value;
      audio.setSoundMode(e.target.value);
    });
  }
  if (modalLabelsSelect) {
    modalLabelsSelect.addEventListener('change', (e) => {
      labelsSelect.value = e.target.value;
      piano.labelMode = e.target.value;
    });
  }
  if (modalScaleSelect) {
    modalScaleSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (scaleSelect) scaleSelect.value = val;
      if (customScaleSelect) customScaleSelect.value = val;
    });
  }
  if (customScaleSelect) {
    customScaleSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (scaleSelect) scaleSelect.value = val;
      if (modalScaleSelect) modalScaleSelect.value = val;
    });
  }
  if (modalSpeedSelect) {
    modalSpeedSelect.addEventListener('change', (e) => {
      speedSelect.value = e.target.value;
      waterfall.playbackRate = parseFloat(e.target.value);
    });
  }

  // =========================================================================
  // Fidelity / Performance Mode (Tablet / Mi Pad SE Optimization)
  // =========================================================================
  const isBudgetOrTablet = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Tablet/i.test(navigator.userAgent) ||
    (window.innerWidth <= 1024 && ('ontouchstart' in window || navigator.maxTouchPoints > 0));

  const savedFidelity = localStorage.getItem('henrysia_fidelity') || (isBudgetOrTablet ? 'low' : 'medium');

  function applyFidelity(mode) {
    if (fidelitySelect) fidelitySelect.value = mode;
    if (modalFidelitySelect) modalFidelitySelect.value = mode;
    waterfall.setFidelity(mode);
    audio.setFidelity(mode);
    piano.setFidelity(mode);
    localStorage.setItem('henrysia_fidelity', mode);
  }

  if (fidelitySelect) {
    fidelitySelect.addEventListener('change', (e) => applyFidelity(e.target.value));
  }
  if (modalFidelitySelect) {
    modalFidelitySelect.addEventListener('change', (e) => applyFidelity(e.target.value));
  }

  // Apply default or saved fidelity immediately
  applyFidelity(savedFidelity);

  // Download Current Song / Pattern as MIDI
  downloadMidiBtn.addEventListener('click', () => {
    if (!currentNotes || currentNotes.length === 0) {
      alert('No notes available to export!');
      return;
    }
    const cleanName = currentSongTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '.mid';
    MidiWriter.downloadMidi(currentNotes, cleanName, {
      name: currentSongTitle
    });
  });

  // Upload external .mid file
  midiFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = MidiParser.parse(evt.target.result);
        if (parsed.length === 0) {
          alert('No note data found in this MIDI file.');
          return;
        }
        currentSongTitle = file.name.replace(/\.[^/.]+$/, "");
        loadNotes(parsed, `📁 ${currentSongTitle}`);
        waterfall.play();
        updatePlayPauseButton();
      } catch (err) {
        alert('Could not read MIDI file: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  });

  // Drag and Drop MIDI anywhere on window
  window.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });

  window.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.toLowerCase().endsWith('.mid') || file.name.toLowerCase().endsWith('.midi')) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          try {
            const parsed = MidiParser.parse(evt.target.result);
            currentSongTitle = file.name.replace(/\.[^/.]+$/, "");
            loadNotes(parsed, `📁 ${currentSongTitle}`);
            waterfall.play();
            updatePlayPauseButton();
          } catch (err) {
            alert('Error parsing dropped MIDI: ' + err.message);
          }
        };
        reader.readAsArrayBuffer(file);
      }
    }
  });

  // Custom Pattern Generator Modal
  openCustomModalBtn.addEventListener('click', () => {
    customModal.classList.add('active');
  });

  closeModalBtn.addEventListener('click', () => {
    customModal.classList.remove('active');
  });

  customModal.addEventListener('click', (e) => {
    if (e.target === customModal) {
      customModal.classList.remove('active');
    }
  });

  applyCustomPatternBtn.addEventListener('click', () => {
    const text = customTextInput.value.trim() || 'HENRY';
    const mode = customModeSelect.value;
    const scale = customScaleSelect.value || 'whiteKeys';

    let notes;
    if (text === '1-100000' || text === '1 to 100,000' || text === '100000') {
      notes = PatternGenerator.generateNumberStream({ scale });
    } else if (/^[\d\s,]+$/.test(text)) {
      const nums = text.split(/[\s,]+/).filter(Boolean).map(n => parseInt(n, 10)).filter(n => !isNaN(n));
      notes = PatternGenerator.generateHDNumbers(nums.length > 0 ? nums : [123], { scale });
    } else {
      notes = PatternGenerator.generateTextNotes(text, {
        mode,
        scale,
        rowDurationSec: mode === 'banner' ? 0.22 : 0.16
      });
    }

    currentSongTitle = `Pattern: ${text}`;
    loadNotes(notes, `✨ ${currentSongTitle}`);
    customModal.classList.remove('active');
    audio.ensureContext();
    waterfall.play();
    updatePlayPauseButton();
  });

  downloadCustomMidiBtn.addEventListener('click', () => {
    const text = customTextInput.value.trim() || 'HENRY';
    const mode = customModeSelect.value;
    const scale = customScaleSelect.value || 'whiteKeys';

    let notes;
    if (text === '1-100000' || text === '1 to 100,000' || text === '100000') {
      notes = PatternGenerator.generateNumberStream({ scale });
    } else if (/^[\d\s,]+$/.test(text)) {
      const nums = text.split(/[\s,]+/).filter(Boolean).map(n => parseInt(n, 10)).filter(n => !isNaN(n));
      notes = PatternGenerator.generateHDNumbers(nums.length > 0 ? nums : [123], { scale });
    } else {
      notes = PatternGenerator.generateTextNotes(text, {
        mode,
        scale
      });
    }

    const filename = `pattern_${text.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.mid`;
    MidiWriter.downloadMidi(notes, filename, {
      name: `Pattern ${text}`
    });
  });

  // 4. Interactive Piano Touch & Mouse (Multi-Touch for Tablets & iPads)
  const activeTouchNotes = new Map(); // touchId -> midiNote
  let activeMouseNote = null;

  function getTouchCanvasCoords(touch) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  }

  function getMouseCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  // Mouse Playing (Desktop)
  function handleMouseDown(e) {
    audio.ensureContext();
    const { x, y } = getMouseCanvasCoords(e);
    const key = piano.getKeyAt(x, y, waterfall.cssWidth, waterfall.cssHeight, waterfall.keyboardHeight);
    if (key) {
      activeMouseNote = key.midi;
      audio.playNote(key.midi, 0.85);
      piano.setNoteState(key.midi, true, { color: '#00e5ff', isUser: true });
      waterfall.spawnHitParticles(key.x, waterfall.cssHeight - waterfall.keyboardHeight, key.width, '#00e5ff');
    }
  }

  function handleMouseMove(e) {
    if (activeMouseNote === null && !e.buttons) return;
    const { x, y } = getMouseCanvasCoords(e);
    const key = piano.getKeyAt(x, y, waterfall.cssWidth, waterfall.cssHeight, waterfall.keyboardHeight);
    if (key && key.midi !== activeMouseNote) {
      if (activeMouseNote !== null) {
        audio.stopNote(activeMouseNote);
        piano.setNoteState(activeMouseNote, false);
      }
      activeMouseNote = key.midi;
      audio.playNote(key.midi, 0.85);
      piano.setNoteState(key.midi, true, { color: '#00e5ff', isUser: true });
      waterfall.spawnHitParticles(key.x, waterfall.cssHeight - waterfall.keyboardHeight, key.width, '#00e5ff');
    }
  }

  function handleMouseUp() {
    if (activeMouseNote !== null) {
      audio.stopNote(activeMouseNote);
      piano.setNoteState(activeMouseNote, false);
      activeMouseNote = null;
    }
  }

  canvas.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);

  // Multi-Touch Playing (Tablets & Mobile - All Fingers Polyphonic!)
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    audio.ensureContext();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const { x, y } = getTouchCanvasCoords(touch);
      const key = piano.getKeyAt(x, y, waterfall.cssWidth, waterfall.cssHeight, waterfall.keyboardHeight);
      if (key) {
        activeTouchNotes.set(touch.identifier, key.midi);
        audio.playNote(key.midi, 0.9);
        piano.setNoteState(key.midi, true, { color: '#00e5ff', isUser: true });
        waterfall.spawnHitParticles(key.x, waterfall.cssHeight - waterfall.keyboardHeight, key.width, '#00e5ff');
      }
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const { x, y } = getTouchCanvasCoords(touch);
      const key = piano.getKeyAt(x, y, waterfall.cssWidth, waterfall.cssHeight, waterfall.keyboardHeight);
      const currentNote = activeTouchNotes.get(touch.identifier);

      if (key && key.midi !== currentNote) {
        if (currentNote !== undefined) {
          audio.stopNote(currentNote);
          piano.setNoteState(currentNote, false);
        }
        activeTouchNotes.set(touch.identifier, key.midi);
        audio.playNote(key.midi, 0.9);
        piano.setNoteState(key.midi, true, { color: '#00e5ff', isUser: true });
        waterfall.spawnHitParticles(key.x, waterfall.cssHeight - waterfall.keyboardHeight, key.width, '#00e5ff');
      } else if (!key && currentNote !== undefined) {
        audio.stopNote(currentNote);
        piano.setNoteState(currentNote, false);
        activeTouchNotes.delete(touch.identifier);
      }
    }
  }, { passive: false });

  function handleTouchEnd(e) {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const note = activeTouchNotes.get(touch.identifier);
      if (note !== undefined) {
        audio.stopNote(note);
        piano.setNoteState(note, false);
        activeTouchNotes.delete(touch.identifier);
      }
    }
  }

  window.addEventListener('touchend', handleTouchEnd);
  window.addEventListener('touchcancel', handleTouchEnd);

  // 5. Computer Keyboard QWERTY Playing
  const KEY_NOTE_MAP = {
    // Octave 4 (Middle C)
    'KeyA': 60, // C4
    'KeyW': 61, // C#4
    'KeyS': 62, // D4
    'KeyE': 63, // D#4
    'KeyD': 64, // E4
    'KeyF': 65, // F4
    'KeyT': 66, // F#4
    'KeyG': 67, // G4
    'KeyY': 68, // G#4
    'KeyH': 69, // A4
    'KeyU': 70, // A#4
    'KeyJ': 71, // B4
    'KeyK': 72, // C5
    'KeyO': 73, // C#5
    'KeyL': 74, // D5
    'KeyP': 75, // D#5
    'Semicolon': 76 // E5
  };

  const activeQwerty = new Set();

  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    if (e.code === 'Space') {
      e.preventDefault();
      playPauseBtn.click();
      return;
    }

    if (KEY_NOTE_MAP[e.code] && !activeQwerty.has(e.code)) {
      audio.ensureContext();
      activeQwerty.add(e.code);
      const midi = KEY_NOTE_MAP[e.code];
      const key = piano.getKey(midi);
      audio.playNote(midi, 0.9);
      piano.setNoteState(midi, true, { color: '#ff0077', isUser: true });
      if (key) {
        waterfall.spawnHitParticles(key.x, waterfall.cssHeight - waterfall.keyboardHeight, key.width, '#ff0077');
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    if (KEY_NOTE_MAP[e.code]) {
      activeQwerty.delete(e.code);
      const midi = KEY_NOTE_MAP[e.code];
      audio.stopNote(midi);
      piano.setNoteState(midi, false);
    }
  });

  // 6. Animation Loop (60 FPS)
  function renderLoop(time) {
    waterfall.updateAndRender(time);
    if (waterfall.isPlaying) {
      timelineSlider.value = waterfall.currentTime;
      timeCurrentEl.textContent = formatTime(waterfall.currentTime);
    }
    requestAnimationFrame(renderLoop);
  }

  // Initial song load: 💎 123 456 789 HD Gem Showcase (PianoBit Aesthetic)
  songSelect.value = 'hd_gem_123_456_789';
  loadSongById('hd_gem_123_456_789');
  requestAnimationFrame(renderLoop);
});
