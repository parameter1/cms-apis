import AbstractDataSource from './-abstract.js';

export default class WebsiteSectionDataSource extends AbstractDataSource {
  test() {
    console.log('WebsiteSectionDataSource.test');
    return this;
  }
}
