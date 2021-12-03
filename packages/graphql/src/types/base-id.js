import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language/index.js';

const pattern = /^[0-9a-f]{24}$/i;

const createError = (value) => new TypeError(`The provided value "${value}" is not a valid Int or ObjectID.`);

export default (ObjectId) => {
  const createFromString = (value) => {
    if (typeof value === 'object' && pattern.test(`${value}`)) return `${value}`;

    if (typeof value !== 'string') throw createError(value);
    if (pattern.test(value)) return ObjectId.createFromHexString(value);

    const int = parseInt(value, 10);
    if (int == null || Number.isNaN(int)) throw createError(value);
    return int;
  };

  return new GraphQLScalarType({
    name: 'BaseID',
    description: 'A BaseCMS identifier: either an integer or an ObjectId.',
    parseValue(value) {
      if (typeof value === 'number') return parseInt(value, 10);
      return createFromString(value);
    },
    serialize(value) {
      if (typeof value === 'number') return parseInt(value, 10);
      if (value instanceof ObjectId) return value.toHexString();
      try {
        return createFromString(value);
      } catch (e) {
        return null;
      }
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) return ast.value;
      if (ast.kind === Kind.STRING) return createFromString(ast.value);
      throw createError(ast.value);
    },
  });
};
