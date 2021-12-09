import { getAsArray } from '@cms-apis/object-path';
import { cleanWebsite } from '@cms-apis/clean-string';
import { trim } from '@cms-apis/utils';
import socialProviders from './social-providers.js';

export default (doc, path = 'socialLinks') => getAsArray(doc, path).map((link) => {
  if (!link) return null;
  const url = cleanWebsite(link.url);
  if (!url) return null;

  let label = trim(link.label);
  let provider = trim(link.provider);
  if ((!provider || provider.toUpperCase() === 'OTHER') && label && socialProviders.has(label.toUpperCase())) {
    provider = label;
  }
  if (!provider) provider = 'Other';
  provider = provider.toUpperCase();
  if (!label && provider !== 'OTHER') label = socialProviders.get(provider);
  return { provider, url, label };
}).filter((v) => v);
