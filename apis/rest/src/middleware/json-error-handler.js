// eslint-disable-next-line no-unused-vars
export default () => (err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  const showStackTrace = process.env.NODE_ENV === 'development';

  const { stack } = err;
  const obj = {
    data: [],
    errors: {
      status: `${status}`,
      detail: err.message,
      code: `${err.code || 0}`,
      ...(showStackTrace && stack && { stack: stack.split('\n') }),
    },
  };
  res.status(status).json(obj);
};
