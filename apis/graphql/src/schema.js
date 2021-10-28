import { makeExecutableSchema } from '@graphql-tools/schema';
import resolvers from './resolvers/index.js';
import typeDefs from './definitions/index.js';
import { enumDefaultValuesTransformer } from './enums.js';
import {
  connectionProjectDirectiveTransformer,
  interfaceFieldsDirectiveTransformer,
  projectDirectiveTransformer,
} from './directives/index.js';

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

// interface fields must be copied to each type _before_ applying projection
const withInterfaceFields = interfaceFieldsDirectiveTransformer(schema);
const withProjectSchema = projectDirectiveTransformer(withInterfaceFields, 'project');
const withConnectionProject = connectionProjectDirectiveTransformer(withProjectSchema, 'connectionProject');

// "hack" for handling enum default
const withEnumDefaults = enumDefaultValuesTransformer(withConnectionProject);

export default withEnumDefaults;
