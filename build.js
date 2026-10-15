// Simple build script to create dist directory for static deployment
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

const itemsToCopy = ['index.html', 'css', 'js', 'staticwebapp.config.json', 'README.md'];

itemsToCopy.forEach(item => {
  const src = path.join(__dirname, item);
  const dest = path.join(distDir, item);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
  }
});

console.log('Build complete: static files copied to dist/');
