import http from 'node:http';

import { fetchKdgRssFeed } from '@kdg/feed';

import { config } from '#config';

const server = http.createServer(async (req, res) => {
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

  const feed = await fetchKdgRssFeed(config.kdgFeed.id, config.kdgFeed.accessKey, 1);
  if (!feed.isOk()) {
    console.log('error', feed.error);
    res.writeHead(502, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        error: {
          message: 'Fetching RSS feed from Kerkdienstgemist failed',
        },
      }),
    );
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify({ ok: true }));
});

server.listen(config.port, config.host, () => {
  console.log(`Server listening on ${config.host}:${config.port}`);
});
