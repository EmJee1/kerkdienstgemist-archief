import { valueForEnvironment } from '#environment';

function stringConfigOrFail(variable: string) {
  const value = process.env[variable];
  if (!value) {
    console.log(`Missing required environment variable "${variable}"`);
    process.exit(1);
  }

  return value;
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
