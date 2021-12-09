import WebsiteDataSource from './website.js';
import WebsiteSectionDataSource from './website-section.js';

export default class DataSources {
  constructor({ db } = {}) {
    this.db = db;
    this.dataSources = new Map();

    this.add('websites', WebsiteDataSource);
    this.add('website-sections', WebsiteSectionDataSource);
  }

  add(key, DataSource) {
    if (this.dataSources.has(key)) return this;
    const repo = this.db.repo(key);
    this.dataSources.set(key, new DataSource({ repo, dataSources: this }));
    return this;
  }

  get(key) {
    const dataSource = this.dataSources.get(key);
    if (!dataSource) throw new Error(`No data source found for ${key}`);
    return dataSource;
  }
}
