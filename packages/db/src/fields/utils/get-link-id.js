import { get } from '@cms-apis/object-path';

export default (links, name) => get(links, `${name}.linkage.id`);
