export default (app) => {
  app.get('/', (_, res) => {
    res.json({ ping: 'pong' });
  });
};
