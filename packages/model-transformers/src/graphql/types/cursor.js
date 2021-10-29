import { GraphQLScalarType } from 'graphql';
import { encodeCursor, decodeCursor } from '../utils/cursor.js';

export default new GraphQLScalarType({
  name: 'Cursor',
  serialize(value) {
    return value == null ? null : encodeCursor(value);
  },
  parseValue(value) {
    return value == null ? null : decodeCursor(value);
  },
  parseLiteral() {
    throw new Error('Parsing literal Cursor values is not yet supported.');
  },
});
