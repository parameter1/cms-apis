import gql from '@cms-apis/graphql/tag';
import { extractFragmentData } from '@cms-apis/graphql/fragments';

export default ({ type, relationships = new Map(), selected = [] } = {}) => {
  const include = new Set(selected);
  let selections = [];
  if (include.size) {
    include.forEach((name) => {
      if (relationships.has(name)) selections.push(name);
    });
  } else {
    relationships.forEach((_, name) => selections.push(name));
  }
  selections = selections.map((field) => `${field} { linkage { id type } self related }`);

  const name = `${type}LinksFragment`;
  return extractFragmentData(gql`
    fragment ${name} on ${type} {
      links {
        self
        ${selections.join('\n        ')}
      }
    }
  `);
};
