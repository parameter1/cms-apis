import { Repo } from '@cms-apis/mongodb';
import Joi, { validateAsync } from '@cms-apis/joi';
import { get, getAsArray } from '@cms-apis/object-path';
import { inspect } from 'util';
import AbstractDataSource from './-abstract.js';
import {
  createLinks,
  intLinkage,
  oidLinkage,
  payload as restPayload,
} from '../fields/rest/index.js';
import sectionFields from '../fields/models/website-section.js';
import websiteFields from '../fields/models/website.js';
import generateSlugFrom from '../fields/utils/generate-slug-from.js';

export default class WebsiteSectionDataSource extends AbstractDataSource {
  /**
   * Once created:
   *  - push section to `websites._connection.sections`
   *  - if parent is present
   *    - push section to related `_connection.descendants`
   *    - generate `name.full`
   *    - generate `alias` from `_connection.ancestors` + `slug`
   *
   * @param {object} params
   * @param {object} options
   * @returns {Promise<object>}
   */
  async create(params = {}) {
    const {
      description,
      name,
      parentId,
      seo,
      sequence,
      slug,
      websiteId,
    } = await validateAsync(Joi.object({
      description: sectionFields.description.default(null),
      name: sectionFields.name.required(),
      parentId: sectionFields.id.default(null),
      seo: sectionFields.seo,
      sequence: sectionFields.sequence,
      slug: sectionFields.slug.required(),
      websiteId: websiteFields.id.required(),
    }).required(), {
      ...params,
      ...(!params.slug && params.name && { slug: generateSlugFrom(params.name) }),
    });

    // @todo dataloader?
    const [website, parent] = await Promise.all([
      this.dataSources.get('websites').findById({
        id: websiteId,
        options: { strict: true, projection: { name: 1 } },
      }),
      parentId ? this.findById({
        id: parentId,
        options: {
          strict: true,
          projection: {
            name: 1,
            slug: 1,
            alias: 1,
            depth: 1,
            '_edge.website.node._id': 1,
            '_connection.ancestors': 1,
          },
        },
      }) : null,
    ]);

    if (parent) {
      const parentWebsiteId = get(parent, '_edge.website.node._id');
      if (`${parentWebsiteId}` !== `${website._id}`) {
        throw Repo.createError(400, `The parent section's website ID (${parentWebsiteId}) does not match this section's website ID (${website._id})`);
      }
    }
    const parentNode = parent ? { _id: parent._id, alias: parent.alias, name: parent.name } : null;

    // @todo do incoming values need to be sanitized/hydrated???
    const doc = {
      _connection: {
        ancestors: parent ? [
          ...getAsArray(parent, '_connection.ancestors'),
          { depth: parent.alias.split('/').length, node: parentNode },
        ] : [],
        descendants: [],
        related: [],
      },
      _edge: {
        coverImage: null, // @todo
        logo: null, // @todo
        parent: parent ? { node: parentNode } : null,
        website: { node: website },
      },
      alias: parent ? `${parent.alias}/${slug}` : slug,
      depth: parent ? parent.depth + 1 : 1,
      description,
      metadata: {}, // @todo
      name: {
        default: name,
        full: parent ? `${parent.name.full} > ${name}` : name,
      },
      redirects: [], // @todo
      seo,
      sequence,
      slug,
    };

    console.log(inspect(doc, { colors: true, depth: 5 }));

    return this;
  }

  /**
   *
   *
   * @param {object} params
   * @returns {Promise<object>}
   */
  async createFromRestPayload(params = {}) {
    const obj = await validateAsync(restPayload({
      name: sectionFields.name.required(),
      alias: Joi.string(),
      canonicalUrl: sectionFields.seo.canonicalUrl,
      links: createLinks({
        parent: intLinkage,
        site: oidLinkage.required(),
      }),
      seoTitle: sectionFields.seo.title,
      seoDescription: sectionFields.seo.description,
      sequence: sectionFields.sequence,
    }), params);

    const { links } = obj;
    const slug = obj.alias ? obj.alias.split('/').pop() : null;

    return this.create({
      name: obj.name,
      parentId: get(links, 'parent.linkage.id'),
      seo: {
        title: obj.seoTitle,
        description: obj.seoDescription,
        canonicalUrl: obj.canonicalUrl,
      },
      slug,
      sequence: obj.sequence,
      websiteId: get(links, 'site.linkage.id'),
    });
  }
}
