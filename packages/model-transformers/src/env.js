import {
  cleanEnv,
  str,
} from 'envalid';

export const {
  LEGACY_MONGO_URL,
  MONGO_URL,
} = cleanEnv(process.env, {
  LEGACY_MONGO_URL: str({ desc: 'The Base Platform (legacy) MongoDB server to connect to.' }),
  MONGO_URL: str({ desc: 'The Base Platform (legacy) MongoDB server to connect to.' }),
});
