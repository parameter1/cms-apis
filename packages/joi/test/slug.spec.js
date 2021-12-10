/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import Joi from 'joi';
import str from '../src/types/str.js';
import slug from '../src/types/slug.js';

const { ValidationError } = Joi;
const Schema = Joi.extend(str).extend(slug);

describe('slug', () => {
  it('should allow null default values', () => {
    const result = Joi.attempt(undefined, Schema.slug().default(null));
    expect(result).to.be.null;
  });

  it('should return the slug when valid', () => {
    const value = 'hello-world-1234-its-n1ce';
    const result = Joi.attempt(value, Schema.slug());
    expect(result).to.eq(value);
  });

  it('should lowercase and return the slug when valid', () => {
    const value = 'hEllo-wOrlD-1234-its-n1ce';
    const result = Joi.attempt(value, Schema.slug());
    expect(result).to.eq(value.toLowerCase());
  });

  it('should throw a validation error when not alphanumeric', () => {
    expect(() => {
      Joi.attempt('hello world', Schema.slug());
    }).to.throw(ValidationError, 'fails to match the lowercase alpha-numeric with dashes pattern');
  });

  it('should throw a validation error when more than one dash is encountered', () => {
    expect(() => {
      Joi.attempt('hello--world', Schema.slug());
    }).to.throw(ValidationError, 'matches the inverted more than one consecutive dash pattern');
  });

  it('should throw a validation error when the value starts with a dash', () => {
    expect(() => {
      Joi.attempt('-hello-world', Schema.slug());
    }).to.throw(ValidationError, 'matches the inverted starting with a dash pattern');
  });

  it('should throw a validation error when the value ends with a dash', () => {
    expect(() => {
      Joi.attempt('hello-world-', Schema.slug());
    }).to.throw(ValidationError, 'matches the inverted ending with a dash pattern');
  });

  describe('when given an undefined value', () => {
    it('should throw a validation error when required', () => {
      expect(() => {
        Joi.attempt(undefined, Schema.slug().required());
      }).to.throw(ValidationError, '"value" is required');
    });

    it('should return undefined when not required', () => {
      const result = Joi.attempt(undefined, Schema.slug());
      expect(result).to.be.undefined;
    });

    it('should return a default value when specified', () => {
      const result = Joi.attempt(undefined, Schema.slug().default('Foo'));
      expect(result).to.eq('Foo');
    });
  });

  describe('when given a null value', () => {
    it('should throw a validation error when required', () => {
      expect(() => {
        Joi.attempt(null, Schema.slug().required());
      }).to.throw(ValidationError, '"value" is required');
    });

    it('should return null when not required', () => {
      const result = Joi.attempt(null, Schema.slug());
      expect(result).to.be.null;
    });

    it('should return a default value when specified', () => {
      const result = Joi.attempt(null, Schema.slug().default('foo'));
      expect(result).to.eq('foo');
    });
  });

  describe('when given an empty string value', () => {
    it('should throw a validation error when required', () => {
      expect(() => {
        Joi.attempt('', Schema.slug().required());
      }).to.throw(ValidationError, '"value" is required');
    });

    it('should return null when not required', () => {
      const result = Joi.attempt('', Schema.slug());
      expect(result).to.be.null;
    });

    it('should return a default value when specified', () => {
      const result = Joi.attempt('', Schema.slug().default('foo'));
      expect(result).to.eq('foo');
    });
  });

  describe('when given a value that will resolve to an empty string', () => {
    it('should throw a validation error when required', () => {
      expect(() => {
        Joi.attempt('   ', Schema.slug().required());
      }).to.throw(ValidationError, '"value" is required');
    });

    it('should return null when not required', () => {
      const result = Joi.attempt('   ', Schema.slug());
      expect(result).to.be.null;
    });

    it('should return a default value when specified', () => {
      const result = Joi.attempt('   ', Schema.slug().default('foo'));
      expect(result).to.eq('foo');
    });
  });

  describe('when given a non-empty string value', () => {
    it('should always return the trimmed value', () => {
      expect(Joi.attempt(' foo ', Schema.slug())).to.eq('foo');
      expect(Joi.attempt('  bar   ', Schema.slug())).to.eq('bar');
    });
  });

  describe('when given any other value', () => {
    it('should throw a validation error', () => {
      const values = [{}, [], 1, true, false, NaN, 0];
      values.forEach((value) => {
        expect(() => {
          Joi.attempt(value, Schema.slug());
        }).to.throw(ValidationError, '"value" must be a string');
      });
    });
  });
});
