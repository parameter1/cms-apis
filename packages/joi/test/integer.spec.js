/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import Joi from 'joi';
import integer from '../src/types/integer.js';

const { ValidationError } = Joi;
const Schema = Joi.extend(integer);

describe('integer', () => {
  it('should allow null default values', () => {
    const result = Joi.attempt(undefined, Schema.integer().default(null));
    expect(result).to.be.null;
  });
  describe('when given an undefined value', () => {
    it('should throw a validation error when required', () => {
      expect(() => {
        Joi.attempt(undefined, Schema.integer().required());
      }).to.throw(ValidationError, '"value" is required');
    });

    it('should return undefined when not required', () => {
      const result = Joi.attempt(undefined, Schema.integer());
      expect(result).to.be.undefined;
    });

    it('should return a default value when specified', () => {
      const result = Joi.attempt(undefined, Schema.integer().default(0));
      expect(result).to.eq(0);
    });
  });

  describe('when given a null value', () => {
    it('should throw a validation error when required', () => {
      expect(() => {
        Joi.attempt(null, Schema.integer().required());
      }).to.throw(ValidationError, '"value" is required');
    });

    it('should return null when not required', () => {
      const result = Joi.attempt(null, Schema.integer());
      expect(result).to.be.null;
    });

    it('should return a default value when specified', () => {
      const result = Joi.attempt(null, Schema.integer().default(0));
      expect(result).to.eq(0);
    });
  });

  describe('when given a 0 value', () => {
    it('should return 0 and not throw an error when required', () => {
      const r1 = Joi.attempt(0, Schema.integer().required());
      expect(r1).to.eq(0);
      const r2 = Joi.attempt('0', Schema.integer().required());
      expect(r2).to.eq(0);
    });
  });

  describe('when given a integer-like string value', () => {
    it('should return the converted, integer value', () => {
      const r1 = Joi.attempt('2', Schema.integer());
      expect(r1).to.eq(2);
      const r2 = Joi.attempt('-2', Schema.integer());
      expect(r2).to.eq(-2);
    });
  });

  describe('when given a float value', () => {
    it('should throw a validation error', () => {
      expect(() => {
        Joi.attempt(2.7, Schema.integer());
      }).to.throw(ValidationError, '"value" must be an integer');
    });
  });

  describe('when given a float-like string value', () => {
    it('should throw a validation error', () => {
      expect(() => {
        Joi.attempt('2.7', Schema.integer());
      }).to.throw(ValidationError, '"value" must be an integer');
    });
  });
});
