/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import Joi from '@cms-apis/joi';
import integerId from '../../src/fields/integer-id.js';

const { ValidationError } = Joi;

describe('fields/integer-id', () => {
  it('should implement the integer type.', () => {
    expect(integerId.type).to.eq('integer');
  });

  it('should throw a validation error when the id is less than 1', () => {
    const ids = ['0', 0, -1, '-1'];
    ids.forEach((id) => {
      expect(() => {
        Joi.attempt(id, integerId);
      }).to.throw(ValidationError, '"value" must be greater than or equal to 1');
    });
  });

  describe('when given an empty (undefined/null) value', () => {
    const values = [undefined, null];
    it('should return the empty value when not required', () => {
      values.forEach((value) => {
        const result = Joi.attempt(value, integerId);
        expect(result).to.eq(value);
      });
    });
    it('should throw a validation error when required', () => {
      values.forEach((value) => {
        expect(() => {
          Joi.attempt(value, integerId.required());
        }).to.throw(ValidationError, '"value" is required');
      });
    });
  });
});
