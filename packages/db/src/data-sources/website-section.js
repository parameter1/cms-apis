import { Repo } from '@cms-apis/mongodb';
import Joi, { validateAsync } from '@cms-apis/joi';
import { get, getAsArray } from '@cms-apis/object-path';
import cleanString from '@cms-apis/clean-string';
import { inspect } from 'util';
import AbstractDataSource from './-abstract.js';
import generateSlugFrom from '../fields/utils/generate-slug-from.js';
import getLinkId from '../fields/utils/get-link-id.js';

import {
  createLinks,
  intLinkage,
  oidLinkage,
  payload as restPayload,
} from '../fields/rest/index.js';

import sectionFields from '../fields/models/website-section.js';
import seoFields from '../fields/seo.js';
import websiteFields from '../fields/models/website.js';

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

    const [website, parent] = await Promise.all([
      this.dataSources.get('websites').load({
        value: websiteId,
        projection: { name: 1, description: 1 },
        strict: true,
      }),
      parentId ? this.load({
        value: parentId,
        projection: {
          name: 1,
          slug: 1,
          alias: 1,
          depth: 1,
          '_edge.website.node._id': 1,
          '_connection.ancestors': 1,
        },
        strict: true,
      }) : null,
    ]);

    const nodes = {
      parent: parent ? { _id: parent._id, alias: parent.alias, name: parent.name } : null,
      website: { _id: website._id, name: website.name },
    };

    if (parent) {
      const parentWebsiteId = get(parent, '_edge.website.node._id');
      if (`${parentWebsiteId}` !== `${website._id}`) {
        throw Repo.createError(400, `The parent section's website ID (${parentWebsiteId}) does not match this section's website ID (${website._id})`);
      }
    }
    const fullName = parent ? `${parent.name.full} > ${name}` : name;

    // @todo do incoming values need to be sanitized/hydrated???
    const doc = {
      _connection: {
        ancestors: parent ? [
          ...getAsArray(parent, '_connection.ancestors'),
          { depth: parent.alias.split('/').length, node: nodes.parent },
        ] : [],
        descendants: [],
        related: [],
      },
      _edge: {
        coverImage: null, // @todo
        logo: null, // @todo
        parent: parent ? { node: nodes.parent } : null,
        website: { node: nodes.website },
      },
      alias: parent ? `${parent.alias}/${slug}` : slug,
      depth: parent ? parent.depth + 1 : 1,
      description,
      // all metadata fields need html stripped (since these are used in html tags)
      metadata: {
        title: (() => {
          const values = [get(seo, 'title'), fullName, name].map(cleanString).filter((v) => v);
          return values[0];
        })(),
        description: (() => {
          if (seo && seo.description) return cleanString(seo.description);
          if (description) return cleanString(description);
          if (website.description) return cleanString(website.description);
          return `Articles, news, products, blogs and videos from ${cleanString(website.name)}.`;
        })(),
      },
      name: { default: name, full: fullName },
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
      description: sectionFields.description,
      name: sectionFields.name.required(),
      alias: Joi.string(),
      canonicalUrl: seoFields.canonicalUrl,
      links: createLinks({
        coverImage: oidLinkage,
        logo: oidLinkage,
        parent: intLinkage,
        site: oidLinkage.required(),
      }),
      seoTitle: seoFields.title,
      seoDescription: seoFields.description,
      sequence: sectionFields.sequence,
    }), params);

    const { links } = obj;
    const slug = obj.alias ? obj.alias.split('/').pop() : null;

    return this.create({
      coverImageId: getLinkId(links, 'coverImage'),
      description: obj.description,
      logoId: getLinkId(links, 'logo'),
      name: obj.name,
      parentId: getLinkId(links, 'parent'),
      seo: {
        title: obj.seoTitle,
        description: obj.seoDescription,
        canonicalUrl: obj.canonicalUrl,
      },
      slug,
      sequence: obj.sequence,
      websiteId: getLinkId(links, 'site'),
    });
  }
}
