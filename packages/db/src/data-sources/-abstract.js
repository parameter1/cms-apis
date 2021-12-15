export default class AbstractDataSource {
  constructor({ repo, loader, dataSources } = {}) {
    this.repo = repo;
    this.loader = loader;
    this.dataSources = dataSources;
  }

  static buildOnCreateFields({ date = new Date(), context } = {}) {
    const user = AbstractDataSource.getUserFromContext(context);
    // @todo sort and clean these fields!
    return {
      _meta: AbstractDataSource.buildOnCreateMeta({ date, user }),
      _version: AbstractDataSource.buildOnCreateVersion({ date, user }),
    };
  }

  static buildOnCreateMeta({ date, user }) {
    return {
      created: { date, by: user },
      updated: { date, by: user },
    };
  }

  static buildOnCreateVersion({ date, user }) {
    return {
      n: 1,
      history: [{ date, by: user }],
    };
  }

  static getUserFromContext(context = {}) {
    return context.user ? {
      _id: context.user._id,
      username: context.user.username,
      name: context.user.name,
      email: context.user.email,
    } : {
      _id: 'system.core',
    };
  }

  loadWebsite({ id, projection = {}, strict = true } = {}) {
    return this.dataSources.get('websites').load({ value: id, projection, strict });
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
