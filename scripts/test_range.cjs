const http = require('http');

(async () => {
  // Test if http://localhost:5173/media/celebration/celebration-desktop.mp4 handles Range requests
  const options = {
    hostname: 'localhost',
    port: 5173,
    path: '/media/celebration/celebration-desktop.mp4',
    method: 'GET',
    headers: {
      'Range': 'bytes=1000-5000'
    }
  };

  const req = http.request(options, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Accept-Ranges:', res.headers['accept-ranges']);
    console.log('Content-Range:', res.headers['content-range']);
    console.log('Content-Length:', res.headers['content-length']);
    process.exit(0);
  });

  req.on('error', (e) => {
    console.error('Request error:', e.message);
    process.exit(1);
  });

  req.end();
})();
