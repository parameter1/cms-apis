import Joi, { validateAsync } from '@cms-apis/joi';
import AbstractDataSource from './-abstract.js';

export default class WebsiteDataSource extends AbstractDataSource {
  /**
   *
   * @param {object} params
   * @returns {Promise<object>}
   */
  async create(params = {}) {
    const {
      abbreviation,
      assetHost,
      description,
      host,
      imageHost,
      name,
    } = await validateAsync(Joi.object({
      abbreviation: Joi.str().default(null),
      assetHost: Joi.str().domain({ tlds: { allow: true } }).default('cdn.base.parameter1.com'),
      description: Joi.str().default(null),
      host: Joi.str().domain({ tlds: { allow: true } }).required(),
      imageHost: Joi.str().domain({ tlds: { allow: true } }).default('p1-cms-assets.imgix.net'),
      name: Joi.str().required(),
    }), params);

    const doc = {
      _connection: {
        scheduleOptions: [], // should auto create standard option?
        sections: [], // should auto create home section?
      },
      abbreviation,
      description,
      host: {
        asset: assetHost,
        root: host,
      },
      imageHost,
      name,
      origin: `https://${host}`,
    };

    console.log(doc);

    return this;
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
