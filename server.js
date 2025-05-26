const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    console.log(`[${new Date().toISOString()}] SERVER PORT 3001: Received request for: ${req.url} from ${req.socket.remoteAddress}`);

    let relativeFilePath = req.url;
    if (relativeFilePath === '/' || relativeFilePath === '/index.html') {
        relativeFilePath = '/index.html';
    } else if (relativeFilePath === '/about.html') {
        relativeFilePath = '/about.html';
    }
    // Add other specific routes here if needed, e.g., for CSS or JS if not using CDNs

    const filePath = path.join(__dirname, relativeFilePath);

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
    };
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            console.error(`[${new Date().toISOString()}] SERVER PORT 3001: Error reading ${filePath}: ${error.code}`);
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end(`<h1>404 Not Found</h1><p>The page ${req.url} was not found on this server (tried to serve ${filePath}).</p>`, 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            console.log(`[${new Date().toISOString()}] SERVER PORT 3001: Successfully served ${filePath} as ${contentType}`);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const port = 3001;

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${port} is already in use. Please ensure no other process is using it, or change the port in server.js.`);
  } else {
    console.error(`Server error on port ${port}: ${err.message}`);
  }
});

server.listen(port, () => {
    console.log(`Server restored and running at http://localhost:${port}/`);
    console.log(`Serving index.html for '/' and about.html for '/about.html'.`);
    console.log(`Press Ctrl+C to stop the server.`);
});
