import stripTags from 'striptags';
import { decode } from 'html-entities';

const { isArray } = Array;

/**
 *
 * @param {string} value The string value to clean
 * @param {object} options
 * @param {boolean} [options.trim=true] Whether to trim the string.
 * @param {boolean|array} [options.stripHtmlTags=true] If true, will strip all html tags.
 *                        If false will strip none. If array, will preserve the provided tags.
 * @param {boolean} [options.decodeEntities=true] Whether to decode HTML entities.
 */
export default function clean(value, {
  trim = true,
  stripHtmlTags = true,
  decodeEntities = true,
} = {}) {
  if (!value) return '';
  const str = `${value}`;
  const trimmed = trim ? str.trim() : str;
  if (!trimmed) return '';
  const preserveTags = isArray(stripHtmlTags) ? stripHtmlTags : [];
  const stripped = stripHtmlTags ? stripTags(trimmed, preserveTags) : trimmed;
  const decoded = decodeEntities ? decode(stripped) : stripped;
  return decoded;
}

export const cleanWebsite = (value) => {
  const cleaned = clean(value).toLowerCase();
  if (!cleaned) return null;
  if (/^http[s]?:\/\//.test(cleaned)) return cleaned;
  return `https://${cleaned}`;
};