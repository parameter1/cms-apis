export default class AbstractDataSource {
  constructor({ repo, loader, dataSources } = {}) {
    this.repo = repo;
    this.loader = loader;
    this.dataSources = dataSources;
  }

  load(...args) {
    return this.loader.load(...args);
  }

  loadMany(...args) {
    return this.loader.loadMany(...args);
  }

  findById(...args) {
    return this.repo.findById(...args);
  }
}
