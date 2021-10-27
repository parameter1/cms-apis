import {
  cleanEnv,
  port,
  str,
} from 'envalid';

export const {
  LEGACY_MONGO_URL,
  EXPOSED_HOST,
  EXPOSED_PORT,
  HOST,
  PORT,
} = cleanEnv(process.env, {
  LEGACY_MONGO_URL: str({ desc: 'The Base Platform (legacy) MongoDB server to connect to.' }),
  EXPOSED_HOST: str({ desc: 'The host that the service is exposed on.', default: '0.0.0.0' }),
  EXPOSED_PORT: port({ desc: 'The port that the service is exposed on.', default: 80 }),
  HOST: str({ desc: 'The host that the service will run on.', default: '0.0.0.0' }),
  PORT: port({ desc: 'The port that the service will run on.', default: 80 }),
});
