import Joi, { validateAsync } from '@cms-apis/joi';
import AbstractDataSource from './-abstract.js';
import { createLinks, oidLinkage, payload as restPayload } from '../fields/rest/index.js';
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
      name,
      slug,
      websiteId,
    } = await validateAsync(Joi.object({
      name: sectionFields.name.required(),
      slug: sectionFields.slug.required(),
      websiteId: websiteFields.id.required(),
    }), {
      ...params,
      ...(!params.slug && params.name && { slug: generateSlugFrom(params.name) }),
    });

    const website = await this.dataSources.get('websites').findById({
      id: websiteId,
      options: { strict: true, projection: { name: 1 } },
    });

    const doc = {
      _connection: {},
      _edge: {
        website: { node: website },
      },
      name: { default: name },
      slug,
    };

    // on create
    // push section to websites._connection.sections
    // if parent is present

    console.log(doc);

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
      alias: Joi.string().trim(),
      links: createLinks({
        site: oidLinkage.required(),
      }),
    }), params);

    const { links } = obj;
    const slug = obj.alias ? obj.alias.split('/').pop() : null;

    return this.create({
      name: obj.name,
      slug,
      websiteId: links.site.linkage.id,
    });
  }
}
