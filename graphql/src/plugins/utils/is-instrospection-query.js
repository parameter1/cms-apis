/**
 * @param {GraphQLRequestContext} requestContext
 */
export default function isIntrospectionQuery(requestContext) {
  const { operation } = requestContext;
  return operation.selectionSet.selections.every((selection) => {
    const fieldName = selection.name.value;
    return fieldName.startsWith('__');
  });
}
