import { sluggify } from '@cms-apis/slug';
import cleanString from '@cms-apis/clean-string';

export default (value) => sluggify(cleanString(value));
