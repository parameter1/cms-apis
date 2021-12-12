import Joi, { validateAsync } from '@cms-apis/joi';
import { get } from '@cms-apis/object-path';
import { inspect } from 'util';
import AbstractDataSource from './-abstract.js';
import { createLinks, oidLinkage, payload as restPayload } from '../fields/rest/index.js';
import optionFields from '../fields/models/website-schedule-option.js';
import websiteFields from '../fields/models/website.js';
import generateSlugFrom from '../fields/utils/generate-slug-from.js';

export default class WebsiteSectionDataSource extends AbstractDataSource {
  /**
   *
   * @param {object} params
   * @param {object} options
   * @returns {Promise<object>}
   */
  async create(params = {}) {
    const {
      description,
      name,
      slug,
      websiteId,
    } = await validateAsync(Joi.object({
      description: optionFields.description.default(null),
      name: optionFields.name.required(),
      slug: optionFields.slug.required(),
      websiteId: websiteFields.id.required(),
    }).required(), {
      ...params,
      ...(!params.slug && params.name && { slug: generateSlugFrom(params.name) }),
    });

    // @todo dataloader?
    const website = await this.dataSources.get('websites').findById({
      id: websiteId,
      options: { strict: true, projection: { name: 1 } },
    });

    const doc = {
      _edge: {
        website: { node: website },
      },
      description,
      name: { default: name, full: `${website.name} > ${name}` },
      slug,
    };

    console.log(inspect(doc, { colors: true, depth: 5 }));

    return this;
  }

  /**
   *
   * @param {object} params
   * @returns {Promise<object>}
   */
  async createFromRestPayload(params = {}) {
    const obj = await validateAsync(restPayload({
      description: optionFields.description,
      name: optionFields.name.required(),
      links: createLinks({
        site: oidLinkage.required(),
      }),
    }), params);

    return this.create({
      description: obj.description,
      name: obj.name,
      websiteId: get(obj.links, 'site.linkage.id'),
    });
  }
}
