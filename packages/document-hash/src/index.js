import { createHash } from 'crypto';
import prepareDocument from './prepare-document.js';

export default (doc, paths = [], { encoding = 'hex', algorithm = 'sha1' } = {}) => {
  const o = prepareDocument(doc, paths);
  const enc = encoding === 'buffer' ? undefined : encoding;
  return createHash(algorithm).update(JSON.stringify(o), 'utf8').digest(enc);
};

export { default as prepareDocument } from './prepare-document.js';
