import { UserInputError } from 'apollo-server-core';
import isIntrospectionQuery from './utils/is-instrospection-query.js';

export default function CorePlugin() {
  return {
    requestDidStart() {
      return {
        async didResolveOperation(requestContext) {
          const { context, request } = requestContext;
          const { headers } = request.http;

          // let introspection queries pass through.
          if (isIntrospectionQuery(requestContext)) return;

          const tenant = headers.get('x-tenant-key');
          if (!tenant) throw new UserInputError('You must provide a tenant via the `x-tenant-key` header.');

          context.tenant = tenant;
          context.siteId = headers.get('x-site-id');

          console.log(context);
        },
      };
    },
  };
}
