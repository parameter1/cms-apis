import Joi, { validateAsync } from '@cms-apis/joi';
import AbstractDataSource from './-abstract.js';
import { createLinks, oidLinkage, payload as restPayload } from '../fields/rest/index.js';
import optionFields from '../fields/models/website-schedule-option.js';
import websiteFields from '../fields/models/website.js';
import generateSlugFrom from '../fields/utils/generate-slug-from.js';
import getLinkId from '../fields/utils/get-link-id.js';

export default class WebsiteSectionDataSource extends AbstractDataSource {
  /**
   *
   * @param {object} params
   * @param {object} options
   * @returns {Promise<object>}
   */
  async create(params = {}, context = {}) {
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

    const website = await this.loadWebsite({ id: websiteId, projection: { name: 1 } });

    const session = await this.repo.client.startSession();
    session.startTransaction();
    try {
      const doc = {
        _id: await this.repo.generateIntegerId(),
        _edge: { website: { node: website } },
        ...AbstractDataSource.buildOnCreateFields({ context }),
        description,
        name: { default: name, full: `${website.name} > ${name}` },
        slug,
      };

      const [history] = doc._version.history;
      await this.repo.insertOne({ doc, options: { session } });
      await this.dataSources.get('websites').repo.updateOne({
        query: { _id: website._id },
        update: [
          { $set: { '_version.history': { $concatArrays: ['$_version.history', [history]] } } },
          {
            $set: {
              '_version.n': { $size: '$_version.history' },
              '_meta.updated': history,
              '_connection.scheduleOptions': {
                $concatArrays: [
                  '$_connection.scheduleOptions',
                  // @todo rel object nodes should also be cleaned and sorted
                  [{ node: { _id: doc._id, name: { default: doc.name.default }, slug: doc.slug } }],
                ],
              },
            },
          },
        ],
        options: { session },
      });
      await session.commitTransaction();
      return doc;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }

  async update(params = {}) {
    const {
      description,
      name,
      slug,
      websiteId,
    } = await validateAsync(Joi.object({
      description: optionFields.description,
      name: optionFields.name.requiredWhenDefined(),
      slug: optionFields.slug.requiredWhenDefined(),
      websiteId: websiteFields.id.requiredWhenDefined(),
    }).required(), params);

    const website = websiteId
      ? await this.loadWebsite({ id: websiteId, projection: { name: 1 } })
      : null;

    const doc = {
      _id: await this.repo.generateIntegerId(),
      _edge: {
        website: { node: website },
      },
      description,
      name: { default: name, full: `${website.name} > ${name}` },
      slug,
    };
    console.log(doc);
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

    const { links } = obj;
    return this.create({
      description: obj.description,
      name: obj.name,
      websiteId: getLinkId(links, 'site'),
    });
  }
}
