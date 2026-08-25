import { err, ok } from 'neverthrow';

import { valueForEnvironment } from '#environment';

function stringConfigOrFail(variable: string) {
  const value = process.env[variable];
  return value ? ok(value) : err({ kind: 'missingEnvironmentVariable', variable });
}

export const config = valueForEnvironment({
  local: {
    port: 8080,
    host: 'localhost',
    kdgFeed: {
      id: stringConfigOrFail('KDG_FEED_ID'),
      accessKey: stringConfigOrFail('KDG_ACCESS_KEY'),
    },
  },
  staging: {
    port: Number(process.env.PORT),
    host: '0.0.0.0',
    kdgFeed: {
      id: stringConfigOrFail('KDG_FEED_ID'),
      accessKey: stringConfigOrFail('KDG_ACCESS_KEY'),
    },
  },
  production: {
    port: Number(process.env.PORT),
    host: '0.0.0.0',
    kdgFeed: {
      id: stringConfigOrFail('KDG_FEED_ID'),
      accessKey: stringConfigOrFail('KDG_ACCESS_KEY'),
    },
  },
});
