import { createHash } from 'crypto';
import gql from '@cms-apis/graphql/tag';
import { extractFragmentData } from '@cms-apis/graphql/fragments';

export default ({
  type,
  relationships = new Map(),
  selected = [],
  included = [],
  withLinkage = true,
  withUrls = true,
} = {}) => {
  const toSelect = new Set(selected);
  const toInclude = new Set(included);
  let selections = [];
  if (toSelect.size) {
    toSelect.forEach((name) => {
      if (relationships.has(name)) selections.push(name);
    });
  } else {
    relationships.forEach((_, name) => selections.push(name));
  }

  const linkage = 'linkage { id type }';
  const urls = 'self related';

  selections = selections.reduce((arr, field) => {
    const subFields = [];
    if (toInclude.size) {
      arr.push(`${field} { ${toInclude.has(field) ? `${linkage}` : `${urls}`} }`);
      return arr;
    }
    if (withLinkage) subFields.push('linkage { id type }');
    if (withUrls) subFields.push('self related');
    if (subFields.length) arr.push(`${field} { ${subFields.join(' ')} }`);
    return arr;
  }, []);
  const hash = createHash('sha1').update(selections.join('')).digest('hex');
  const name = `${type}LinksFragment${withLinkage ? 'WithLinkage' : ''}${withUrls ? 'WithUrls' : ''}_${hash}`;
  return extractFragmentData(gql`
    fragment ${name} on ${type} {
      links {
        self
        ${selections.join('\n        ')}
      }
    }
  `);
};
