import http from 'node:http';

import { config } from '#config';

const server = http.createServer((req, res) => {
  if (req.url !== '/discover' || req.method !== 'POST') {
    res.writeHead(404, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        error: {
          message: 'The requested endpoint does not exist',
        },
      }),
    );
    return;
  }

  console.log('Received discovery request');

  res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ok: true }));
});

server.listen(config.port, config.host, () => {
  console.log(`Server listening on ${config.host}:${config.port}`);
});
