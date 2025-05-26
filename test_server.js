const http = require('http');
const port = 3003;

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] Received request for: ${req.url} from ${req.socket.remoteAddress}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World! Server is working.\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${port} is already in use. Please try a different port or stop the other process.`);
  } else {
    console.error(`Server error: ${err}`);
  }
  process.exit(1); // Exit if server encounters an error like EADDRINUSE
});

server.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}/`);
  console.log('It will respond with "Hello World!" for all requests.');
  console.log('Press Ctrl+C to stop the server.');
});
