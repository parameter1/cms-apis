import AbstractDataSource from './-abstract.js';

export default class WebsiteDataSource extends AbstractDataSource {
  test() {
    console.log('Website Test that calls section test');
    this.dataSources.get('website-sections').test();
    return this;
  }
}
