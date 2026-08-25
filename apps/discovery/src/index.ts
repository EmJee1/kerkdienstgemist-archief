import http from 'node:http';

import { fetchKdgRssFeed } from '@kdg/feed';
import { Result } from 'neverthrow';

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

  const feedConfig = Result.combine([config.kdgFeed.id, config.kdgFeed.accessKey]);
  if (!feedConfig.isOk()) {
    res.writeHead(500, { 'Content-Type': 'application/json' }).end(
      JSON.stringify({
        error: {
          message: 'Internal server error',
        },
      }),
    );
    return;
  }

  const [kdgFeedId, kdgFeedPlaylistId] = feedConfig.value;
  const feed = await fetchKdgRssFeed(kdgFeedId, kdgFeedPlaylistId, 2);
  if (!feed.isOk()) {
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
