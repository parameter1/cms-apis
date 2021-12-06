import gql from '@cms-apis/graphql/tag';
import { extractFragmentData } from '@cms-apis/graphql/fragments';
import sha1 from '../../utils/sha1.js';

export default ({ type, attributes = new Map(), selected = [] } = {}) => {
  const include = new Set(selected);
  const selections = [];

  const push = (name) => {
    const attr = attributes.get(name);
    if (attr.fields.length) {
      selections.push(`${name} { ${attr.fields.map((f) => f.name).join(' ')} }`);
    } else {
      selections.push(name);
    }
  };

  if (include.size) {
    include.forEach((name) => {
      if (attributes.has(name)) push(name);
    });
  } else {
    attributes.forEach((_, name) => push(name));
  }

  const hash = sha1(selections.join(''));
  const name = `${type}AttributeFragment_${hash}`;
  return extractFragmentData(gql`
    fragment ${name} on ${type} {
      id
      type
      ${selections.join('\n      ')}
    }
  `);
};
