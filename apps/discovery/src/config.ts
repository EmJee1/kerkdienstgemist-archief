import { valueForEnvironment } from '#environment';

export const config = valueForEnvironment({
  local: {
    port: 8080,
    host: 'localhost',
  },
  staging: {
    port: Number(process.env.PORT),
    host: '0.0.0.0',
  },
  production: {
    port: Number(process.env.PORT),
    host: '0.0.0.0',
  },
});
