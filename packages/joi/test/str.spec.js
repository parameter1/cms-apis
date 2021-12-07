import { describe, it } from 'mocha';
import { expect } from 'chai';
import Joi from 'joi';
import str from '../src/types/str.js';

const { ValidationError } = Joi;
const Schema = Joi.extend(str);

describe('str', () => {
  describe('when given an undefined value', () => {
    it('should throw a validation error when required', () => {
      expect(() => {
        Joi.attempt(undefined, Schema.str().required())
      }).to.throw(ValidationError, '"value" is required');
    });

    it('should return undefined when not required', () => {
      const result = Joi.attempt(undefined, Schema.str());
      expect(result).to.be.undefined;
    });
  });

  describe('when given a null value', () => {
    it('should throw a validation error when required', () => {
      expect(() => {
        Joi.attempt(null, Schema.str().required())
      }).to.throw(ValidationError, '"value" is required');
    });

    it('should return null when not required', () => {
      const result = Joi.attempt(null, Schema.str());
      expect(result).to.be.null;
    });
  });

  describe('when given an empty string value', () => {
    it('should throw a validation error when required', () => {
      expect(() => {
        Joi.attempt('', Schema.str().required())
      }).to.throw(ValidationError, '"value" is required');
    });

    it('should return null when not required', () => {
      const result = Joi.attempt('', Schema.str());
      expect(result).to.be.null;
    });
  });

  describe('when given a value that will resolve to an empty string', () => {
    it('should throw a validation error when required', () => {
      expect(() => {
        Joi.attempt('   ', Schema.str().required())
      }).to.throw(ValidationError, '"value" is required');
    });

    it('should return null when not required', () => {
      const result = Joi.attempt('   ', Schema.str());
      expect(result).to.be.null;
    });
  });

  describe('when given a non-empty string value', () => {
    it('should always return the trimmed value', () => {
      expect(Joi.attempt(' foo ', Schema.str())).to.eq('foo');
      expect(Joi.attempt('  bar   ', Schema.str())).to.eq('bar');
    });
  });

  describe('when given any other value', () => {
    it('should throw a validation error', () => {
      const values = [{}, [], 1, true, false, NaN, 0];
      values.forEach((value) => {
        expect(() => {
          Joi.attempt(value, Schema.str());
        }).to.throw(ValidationError, '"value" must be a string');
      });
    });
  });
});
