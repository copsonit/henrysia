# 🎹 Henrysia

A lightweight, high-performance **Visual Piano Waterfall Visualizer & Pattern Player** designed for Henry.

It plays realistic acoustic grand piano audio right in the browser, displays falling note maps onto a 3D virtual keyboard with impact glows and spark particles, and allows creating or exporting custom patterns (names, numbers, shapes, songs) as standard `.mid` files.

---

## ✨ Features

- **Visual Piano Waterfall Engine**:
  - Full 88-key virtual grand piano with realistic 3D ivory keys, ebony black keys, and red damper felt.
  - Smooth 60 FPS falling note waterfall with rounded neon bars, glowing impact laser line, and particle sparks.
  - Multiple color themes: *Classic* (Emerald & Sapphire), *Rainbow Spectrum*, *Cyberpunk Neon*, and *Golden Royalty*.
- **Realistic Piano Sound Engine**:
  - Built with Web Audio API physical harmonic modeling (fundamental + inharmonic partials + hammer strike transient noise + stereo concert hall convolver reverb).
  - 4 selectable sound modes: *Acoustic Grand*, *Warm Studio*, *Electric Keys*, *Bright Piano*.
- **Patterns for Henry**:
  - 🌟 **Henry's Grand Showcase**: Spells `H E N R Y` in giant glowing waterfall notes across the piano with celestial pentatonic bells and celebratory fanfare!
  - 🔢 **Counting Numbers 1 to 10**: Numbers 1 through 10 fall sequentially with rising musical pitches so Henry learns numbers and ear training!
  - 🔤 **Alphabet Waterfall (A to Z)**: Letters scroll down with melodic chimes.
  - 💖 **Shapes & Emoji Parade**: Falling hearts, smiley faces, stars, and musical notes.
  - 🌈 **Rainbow Waterfall & Staircases**: Geometric speed-run staircases and pyramids across all 88 keys.
  - ⭐ **Classic Songs**: *Twinkle Twinkle Little Star*, *Happy Birthday*, *Ode to Joy*, *Für Elise*.
- **Custom Pattern & Message Creator**:
  - Type any word, name, or numbers (e.g. `HENRY`, `12345`, `SUPERSTAR`).
  - Choose layout: *Wide Banner* (all letters across keyboard) or *Sequential* (one big letter at a time).
  - Choose musical scale: *Celestial Pentatonic*, *Joyful Major*, or *Glass Chimes*.
  - Play immediately on screen or click **Download .MID**!
- **Standard MIDI File (.mid) Support**:
  - **Open / Drag & Drop**: Drag ANY `.mid` file from your computer directly into the browser to watch and hear it play.
  - **Save / Export**: 1-click download of any song or generated pattern as a standard Format 0 `.mid` file.
- **Interactive Playing**:
  - Click or drag across the piano keys with mouse or touchscreen / iPad (glissando support).
  - Play with computer keyboard (QWERTY home row keys map to Middle C octave).

---

## 🚀 Running Locally

### Option 1: Node.js (Zero Dependencies)
```bash
npm start
# Or: node server.js
```
Then open `http://localhost:3000` in your web browser.

### Option 2: Python
```bash
python -m http.server 3000
```

### Option 3: Direct Browser File
Since Henrysia is built with standard Web APIs (Canvas + Web Audio API), you can open `index.html` directly in modern browsers (Chrome, Edge, Safari, Firefox).

---

## ☁️ Deploying to Azure

You can host Henrysia on Azure so Henry can play it from an iPad, tablet, or phone anywhere.

### Method 1: Azure Static Web Apps (Recommended & Free)
Microsoft provides a permanent free tier for Static Web Apps with instant global CDN:
1. Push this folder to a GitHub or Azure DevOps repository.
2. In the [Azure Portal](https://portal.azure.com), search for **Static Web Apps** and click **Create**.
3. Select your GitHub repository and branch.
4. Set App location to `/` and leave output/build blank.
5. Click **Create** — the pre-configured [staticwebapp.config.json](file:///c:/Users/conny/henrysia/staticwebapp.config.json) handles everything automatically!

### Method 2: Azure Function (HTTP Trigger)
The project includes a ready-to-deploy Azure Function in the `azure/` directory:
1. Open terminal in the `azure/` folder:
   ```bash
   cd azure
   func start
   ```
2. Deploy to your Azure Function App:
   ```bash
   func azure functionapp publish <YourFunctionAppName>
   ```
3. Access your app via `https://<YourFunctionAppName>.azurewebsites.net/api/index.html`.

---

## 📁 Project Structure

```
henrysia/
├── index.html              # Main HTML5 application
├── css/
│   └── style.css           # Visual piano dark cockpit styling, glowing glassmorphism
├── js/
│   ├── audio.js            # Web Audio API Acoustic Grand Piano synthesizer & reverb
│   ├── piano.js            # 88-key 3D virtual keyboard layout & touch/glissando engine
│   ├── waterfall.js        # 60 FPS HTML5 Canvas waterfall visualizer & particle system
│   ├── font-patterns.js    # 5x7 dot matrix font engine & musical scale harmonization
│   ├── midi-parser.js      # Pure JS binary parser for standard .mid files
│   ├── midi-writer.js      # Pure JS binary encoder to download .mid files
│   ├── song-library.js     # Songs for Henry (Henry Showcase, 1 to 10, ABC, Twinkle)
│   └── app.js              # Application controller & event bindings
├── azure/                  # Azure Function HTTP trigger deployment files
│   ├── host.json
│   ├── local.settings.json
│   └── HenrysiaFunction/
│       ├── function.json
│       └── index.js
├── staticwebapp.config.json # Azure Static Web Apps configuration
├── server.js               # Zero-dependency local Node.js HTTP server
├── package.json
└── README.md
```
