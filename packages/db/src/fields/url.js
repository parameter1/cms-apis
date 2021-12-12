import Joi from '@cms-apis/joi';

export default Joi.string().uri({ scheme: ['http', 'https'], domain: { tlds: { allow: true } } });
