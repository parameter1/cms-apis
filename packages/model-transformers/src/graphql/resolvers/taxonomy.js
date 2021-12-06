import { cleanPath, trim } from '@cms-apis/utils';
import { LegacyDB, types } from '@cms-apis/db';
import { get } from '@cms-apis/object-path';
import { buildObjValues, findMany } from './utils/index.js';
import { sortBy } from '../utils/index.js';

const loadAncestors = async (taxonomy, loaders, taxonomies = []) => {
  const parentId = LegacyDB.extractRefId(taxonomy.parent);
  if (!parentId) return taxonomies;
  const parent = await loaders.get('platform.Taxonomy').load(parentId);
  if (!parent) return taxonomies;
  taxonomies.push(parent);
  return loadAncestors(parent, loaders, taxonomies);
};

const loadDescendants = async (taxonomy, loaders, taxonomies = []) => {
  const children = await loaders.descendantTaxonomies.load(taxonomy._id);
  if (!children.length) return taxonomies;
  taxonomies.push(...children.map((child) => child));
  await Promise.all(children.map((child) => loadDescendants(child, loaders, taxonomies)));
  return taxonomies;
};

const getDepthFor = (taxonomy) => {
  const path = cleanPath(get(taxonomy, 'mutations.Website.urlPath'));
  return path ? path.split('/').length : 0;
};

const hierarchicalTypes = new Set(['Category', 'Award', 'Badge', 'Topic', 'PlatformChannel']);
const isHierarchical = (taxonomy) => hierarchicalTypes.has(taxonomy.type);

export default {
  /**
   *
   */
  Taxonomy: {
    _connection(taxonomy, _, { loaders }) {
      return {
        async ancestors() {
          if (!isHierarchical(taxonomy)) return [];
          const taxonomies = await loadAncestors(taxonomy, loaders, []);
          return sortBy(taxonomies.reverse(), '_id').map((node) => ({
            depth: getDepthFor(node),
            node,
          }));
        },
        async descendants() {
          if (!isHierarchical(taxonomy)) return [];
          const currentDepth = getDepthFor(taxonomy);
          const taxonomies = await loadDescendants(taxonomy, loaders, []);
          return sortBy(taxonomies, '_id').map((node) => ({
            depth: getDepthFor(node) - currentDepth,
            node,
          }));
        },
      };
    },
    _edge(taxonomy, _, { loaders }) {
      return {
        async parent() {
          if (!isHierarchical(taxonomy)) return null;
          const parentId = LegacyDB.extractRefId(taxonomy.parent);
          if (!parentId) return null;
          const node = await loaders.get('platform.Taxonomy').load(parentId);
          if (!node) return null;
          return { node };
        },
      };
    },
    _sync() {
      return {};
    },
    isHierarchical(taxonomy) {
      return isHierarchical(taxonomy);
    },
    depth(taxonomy) {
      return getDepthFor(taxonomy);
    },
    async name(taxonomy, _, { loaders }) {
      const name = trim(taxonomy.name);
      const ancestors = await loadAncestors(taxonomy, loaders, []);
      const hierarchical = [...ancestors.reverse().map((ancestor) => trim(ancestor.name)), name]
        .filter((v) => v)
        .join(' > ');
      return buildObjValues([
        ['default', name],
        ['full', `${taxonomy.type}: ${hierarchical} (${taxonomy._id})`],
        ['hierarchical', hierarchical],
      ]);
    },
    path(taxonomy) {
      return cleanPath(get(taxonomy, 'mutations.Website.urlPath'));
    },
    sequence({ sequence }) {
      return parseInt(sequence, 10) || 0;
    },
    slug(taxonomy) {
      return cleanPath(get(taxonomy, 'mutations.Website.urlName'));
    },
  },

  /**
   *
   */
  TaxonomyTypeEnum: types.get('taxonomy').toJS(),

  /**
   *
   */
  Query: {
    async taxonomyById(_, { input }, { loaders }) {
      const { id } = input;
      return loaders.get('platform.Taxonomy').load(id);
    },

    async taxonomies(_, { input }, { dbs, loaders }) {
      const { after, limit, query } = input;
      return findMany({
        resource: 'platform.Taxonomy',
        after,
        limit,
        query,
      }, { dbs, loaders });
    },
  },
};
