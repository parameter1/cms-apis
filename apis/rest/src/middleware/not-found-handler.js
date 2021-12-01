import createError from 'http-errors';

// Force express to throw 404s instead of handling natively.
// This will move the error into the "standard" error handler.
export default () => (req, res, next) => { // eslint-disable-line no-unused-vars
  throw createError(404, `No page found for ${req.path}`);
};
