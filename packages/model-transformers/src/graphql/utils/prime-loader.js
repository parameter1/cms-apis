export default ({ loader, docs } = {}) => {
  docs.forEach((doc) => loader.prime(`${doc._id}`, doc));
};
