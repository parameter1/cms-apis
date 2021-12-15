import Joi, { validateAsync } from '@cms-apis/joi';
import AbstractDataSource from './-abstract.js';
import websiteFields from '../fields/models/website.js';

export default class WebsiteDataSource extends AbstractDataSource {
  /**
   *
   * @param {object} params
   * @returns {Promise<object>}
   */
  async create(params = {}, context = {}) {
    const {
      abbreviation,
      assetHost,
      description,
      host,
      imageHost,
      name,
    } = await validateAsync(Joi.object({
      abbreviation: websiteFields.abbreviation.default(null),
      assetHost: websiteFields.assetHost.default('cdn.base.parameter1.com'),
      description: websiteFields.description.default(null),
      host: websiteFields.host.required(),
      imageHost: websiteFields.imageHost.default('p1-cms-assets.imgix.net'),
      name: websiteFields.name.required(),
    }), params);

    // @todo sort and clean node (remove nullish, undefined, empty values, etc);
    const doc = {
      _connection: {
        scheduleOptions: [], // should auto create standard option?
        sections: [], // should auto create home section?
      },
      ...AbstractDataSource.buildOnCreateFields({ context }),
      abbreviation,
      description,
      host: { asset: assetHost, image: imageHost, root: host },
      name,
      origin: `https://${host}`,
    };

    await this.repo.insertOne({ doc });
    return doc;
  }

  /**
   *
   * @param {object} params
   * @returns {Promise<object>}
   */
  async createFromRestPayload(params = {}) {
    const obj = await validateAsync(Joi.object().unknown().required(), params);
    return this.create({
      assetHost: obj.assetHost,
      description: obj.description,
      host: obj.host,
      imageHost: obj.imageHost,
      name: obj.name,
    });
  }
}
