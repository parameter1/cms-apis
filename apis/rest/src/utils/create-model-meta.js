import inflector from 'inflected';

const classify = (value) => inflector.classify(inflector.underscore(value));

export default (restType) => {
  const typeParts = restType.split('/').map(classify);
  const msParts = [...typeParts];
  msParts.shift();
  return {
    label: typeParts[typeParts.length - 1],
    description: '',
    modelspace: typeParts[0],
    modelspaceClassName: msParts.join('\\'),
    subClassName: typeParts.join('\\'),
    type: restType,
  };
};
