import Joi from '@cms-apis/joi';
import createLink from './create-link.js';

export default (obj) => {
  let isRequired = false;
  const links = Joi.object(Object.keys(obj).reduce((o, key) => {
    const type = obj[key];
    const required = type.$_getFlag('presence') === 'required';
    const link = createLink(type);
    if (required) {
      isRequired = true;
      link.required();
    }
    return { ...o, [key]: link };
  }, {})).unknown();
  if (isRequired) links.required();
  return links;
};
