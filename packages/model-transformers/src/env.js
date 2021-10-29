import {
  cleanEnv,
  str,
} from 'envalid';

export const {
  CDN_ASSET_HOSTNAME,
  CDN_IMAGE_HOSTNAME,
  LEGACY_MONGO_URL,
  MONGO_URL,
} = cleanEnv(process.env, {
  CDN_ASSET_HOSTNAME: str({ desc: 'The default asset hostname', default: 'cdn.base.parameter1.com' }),
  CDN_IMAGE_HOSTNAME: str({ desc: 'The default image hostname', default: 'p1-cms-assets.imgix.net' }),
  LEGACY_MONGO_URL: str({ desc: 'The Base Platform (legacy) MongoDB server to connect to.' }),
  MONGO_URL: str({ desc: 'The Base Platform (legacy) MongoDB server to connect to.' }),
});
