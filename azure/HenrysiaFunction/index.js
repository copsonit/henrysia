const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mid': 'audio/midi',
  '.midi': 'audio/midi'
};

module.exports = async function (context, req) {
  let file = req.params.file || 'index.html';
  if (file === '' || file === '/') file = 'index.html';

  const rootDir = path.resolve(__dirname, '../../');
  const filePath = path.join(rootDir, file);

  if (!filePath.startsWith(rootDir)) {
    context.res = { status: 403, body: 'Forbidden' };
    return;
  }

  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const content = fs.readFileSync(filePath);

      context.res = {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600'
        },
        isRaw: true,
        body: content
      };
    } else {
      context.res = { status: 404, body: 'File Not Found' };
    }
  } catch (err) {
    context.res = { status: 500, body: 'Internal Server Error: ' + err.message };
  }
};
