import gql from '@cms-apis/graphql/tag';
import { extractFragmentData } from '@cms-apis/graphql/fragments';

export default ({
  type,
  relationships = new Map(),
  selected = [],
  withLinkage = true,
  withUrls = true,
} = {}) => {
  const include = new Set(selected);
  let selections = [];
  if (include.size) {
    include.forEach((name) => {
      if (relationships.has(name)) selections.push(name);
    });
  } else {
    relationships.forEach((_, name) => selections.push(name));
  }
  const includeSelections = withLinkage || withUrls;
  selections = includeSelections ? selections.map((field) => {
    const subFields = [];
    if (withLinkage) subFields.push('linkage { id type }');
    if (withUrls) subFields.push('self related');
    return `${field} { ${subFields.join(' ')} }`;
  }) : [];
  const name = `${type}LinksFragment${withLinkage ? 'WithLinkage' : ''}${withUrls ? 'WithUrls' : ''}`;
  return extractFragmentData(gql`
    fragment ${name} on ${type} {
      links {
        self
        ${selections.join('\n        ')}
      }
    }
  `);
};
