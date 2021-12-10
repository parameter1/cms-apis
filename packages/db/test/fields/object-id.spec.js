/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import Joi from '@cms-apis/joi';
import objectId from '../../src/fields/object-id.js';

const { ValidationError } = Joi;

describe('fields/object-id', () => {
  it('should implement the objectId type.', () => {
    expect(objectId.type).to.eq('objectId');
  });

  describe('when given an empty (undefined/null) value', () => {
    const values = [undefined, null];
    it('should return the empty value when not required', () => {
      values.forEach((value) => {
        const result = Joi.attempt(value, objectId);
        expect(result).to.eq(value);
      });
    });
    it('should throw a validation error when required', () => {
      values.forEach((value) => {
        expect(() => {
          Joi.attempt(value, objectId.required());
        }).to.throw(ValidationError, '"value" is required');
      });
    });
  });
});
