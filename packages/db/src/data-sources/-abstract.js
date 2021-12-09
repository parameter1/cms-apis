export default class AbstractDataSource {
  constructor({ repo, dataSources } = {}) {
    this.repo = repo;
    this.dataSources = dataSources;
  }
}
