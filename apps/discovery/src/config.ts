import { valueForEnvironment } from '#environment';

export const config = valueForEnvironment({
  local: {
    port: 8080,
  },
  staging: {
    port: Number(process.env.PORT),
  },
  production: {
    port: Number(process.env.PORT),
  },
});
