/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import Joi from '../src/index.js';

const { ValidationError } = Joi;

describe('types/number', () => {
  it('should allow null default values', () => {
    const result = Joi.attempt(undefined, Joi.number().default(null));
    expect(result).to.be.null;
  });
  describe('when given an undefined value', () => {
    it('should throw a validation error when required', () => {
      expect(() => {
        Joi.attempt(undefined, Joi.number().required());
      }).to.throw(ValidationError, '"value" is required');
    });

    it('should return undefined when not required', () => {
      const result = Joi.attempt(undefined, Joi.number());
      expect(result).to.be.undefined;
    });

    it('should return a default value when specified', () => {
      const result = Joi.attempt(undefined, Joi.number().default(0));
      expect(result).to.eq(0);
    });
  });

  describe('when given a null value', () => {
    it('should throw a validation error when required', () => {
      expect(() => {
        Joi.attempt(null, Joi.number().required());
      }).to.throw(ValidationError, '"value" is required');
    });

    it('should return null when not required', () => {
      const result = Joi.attempt(null, Joi.number());
      expect(result).to.be.null;
    });

    it('should return a default value when specified', () => {
      const result = Joi.attempt(null, Joi.number().default(0));
      expect(result).to.eq(0);
    });
  });

  describe('when given a 0 value', () => {
    it('should return 0 and not throw an error when required', () => {
      const r1 = Joi.attempt(0, Joi.number().required());
      expect(r1).to.eq(0);
      const r2 = Joi.attempt('0', Joi.number().required());
      expect(r2).to.eq(0);
    });
  });

  describe('when given a float-like string value', () => {
    it('should return the converted, float value', () => {
      const r1 = Joi.attempt('2.1', Joi.number());
      expect(r1).to.eq(2.1);
      const r2 = Joi.attempt('-2.1', Joi.number());
      expect(r2).to.eq(-2.1);
    });
  });

  describe('when given a float value', () => {
    it('should return return the float value', () => {
      const r1 = Joi.attempt(2.1, Joi.number());
      expect(r1).to.eq(2.1);
      const r2 = Joi.attempt(-2.1, Joi.number());
      expect(r2).to.eq(-2.1);
    });
  });

  describe('when given a integer-like string value', () => {
    it('should return the converted, number value', () => {
      const r1 = Joi.attempt('2', Joi.number());
      expect(r1).to.eq(2);
      const r2 = Joi.attempt('-2', Joi.number());
      expect(r2).to.eq(-2);
    });
  });

  describe('when given any other value', () => {
    it('should throw a validation error', () => {
      const values = [{}, [], true, false, NaN, 'foo'];
      values.forEach((value) => {
        expect(() => {
          Joi.attempt(value, Joi.number());
        }).to.throw(ValidationError, '"value" must be a number');
      });
    });
  });
});
