/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import Joi from '@cms-apis/joi';
import { ObjectId } from '@cms-apis/mongodb';
import {
  intArrayLinkage,
  intLinkage,
  oidArrayLinkage,
  oidLinkage,
} from '../../src/fields/linkage.js';

const { ValidationError } = Joi;

describe('fields/linkage', () => {
  describe('arrayLinkage', () => {
    describe('when given an undefined value', () => {
      it('should return an empty array', () => {
        const r1 = Joi.attempt(undefined, oidArrayLinkage);
        expect(r1).to.deep.eq([]);
        const r2 = Joi.attempt(undefined, intArrayLinkage);
        expect(r2).to.deep.eq([]);
      });
      it('throw a validation error when required', () => {
        expect(() => {
          Joi.attempt(undefined, oidArrayLinkage.required());
        }).to.throw(ValidationError, '"value" is required');
        expect(() => {
          Joi.attempt(undefined, intArrayLinkage.required());
        }).to.throw(ValidationError, '"value" is required');
      });
    });
    describe('when given a null value', () => {
      it('should throw a validation error', () => {
        expect(() => {
          Joi.attempt(null, oidArrayLinkage);
        }).to.throw(ValidationError, '"value" must be an array');
        expect(() => {
          Joi.attempt(null, intArrayLinkage);
        }).to.throw(ValidationError, '"value" must be an array');
      });
    });
    describe('when given an empty array', () => {
      it('should return an empty array required', () => {
        const r1 = Joi.attempt([], oidArrayLinkage.required());
        expect(r1).to.deep.eq([]);
        const r2 = Joi.attempt([], intArrayLinkage.required());
        expect(r2).to.deep.eq([]);
      });
      it('should return an empty array when not required', () => {
        const r1 = Joi.attempt([], oidArrayLinkage);
        expect(r1).to.deep.eq([]);
        const r2 = Joi.attempt([], intArrayLinkage);
        expect(r2).to.deep.eq([]);
      });
    });
    describe('when given a non-object array value', () => {
      it('should throw a validation error', () => {
        const values = [[], true, false, NaN, 'foo', null];
        values.forEach((value) => {
          expect(() => {
            Joi.attempt([value], oidArrayLinkage);
          }).to.throw(ValidationError, '"[0]" must be of type object');
          expect(() => {
            Joi.attempt([value], intArrayLinkage);
          }).to.throw(ValidationError, '"[0]" must be of type object');
        });
      });
    });

    describe('when given a object array value', () => {
      it('should throw a validation error when the id is missing', () => {
        const ids = [undefined, null];
        ids.forEach((id) => {
          expect(() => {
            Joi.attempt([{ id }], oidArrayLinkage);
          }).to.throw(ValidationError, '"[0].id" is required');
          expect(() => {
            Joi.attempt([{ id }], intArrayLinkage);
          }).to.throw(ValidationError, '"[0].id" is required');
        });
      });
    });
  });

  describe('linkage', () => {
    it('should throw a validation error when the id is missing', () => {
      const ids = [undefined, null];
      ids.forEach((id) => {
        expect(() => {
          Joi.attempt({ id }, oidLinkage);
        }).to.throw(ValidationError, '"id" is required');
        expect(() => {
          Joi.attempt({ id }, intLinkage);
        }).to.throw(ValidationError, '"id" is required');
      });
    });
    describe('oid', () => {
      it('should return an object with the correct id value', () => {
        const str = '53ca8d671784f8066eb2c949';
        const ids = [new ObjectId(str), str, { toString: () => str }];
        ids.forEach((id) => {
          const result = Joi.attempt({ id }, oidLinkage);
          expect(result).to.deep.eq({ id: new ObjectId(str) });
        });
      });
      it('should throw a validation error when the id is not an objectId', () => {
        const ids = ['', 0, true, false, NaN, 124, '567'];
        ids.forEach((id) => {
          expect(() => {
            Joi.attempt({ id }, oidLinkage);
          }).to.throw(ValidationError, '"id" must be an ObjectId');
        });
      });
    });
    describe('int', () => {
      it('should return an object with the correct id value', () => {
        const ids = ['50', 50];
        ids.forEach((id) => {
          const result = Joi.attempt({ id }, intLinkage);
          expect(result).to.deep.eq({ id: 50 });
        });
      });
      it('should throw a validation error when the id is not an integer', () => {
        const ids = ['', true, false, NaN, 2.5];
        ids.forEach((id) => {
          expect(() => {
            Joi.attempt({ id }, intLinkage);
          }).to.throw(ValidationError, /"id" must be/);
        });
      });
      it('should throw a validation error when the id is less than 1', () => {
        const ids = ['0', 0, -1, '-1'];
        ids.forEach((id) => {
          expect(() => {
            Joi.attempt({ id }, intLinkage);
          }).to.throw(ValidationError, '"id" must be greater than or equal to 1');
        });
      });
    });
  });
});
