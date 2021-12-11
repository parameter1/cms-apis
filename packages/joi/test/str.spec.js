/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import Joi from '../src/index.js';

const { ValidationError } = Joi;

describe('str', () => {
  it('should allow null default values', () => {
    const result = Joi.attempt(undefined, Joi.str().default(null));
    expect(result).to.be.null;
  });
  describe('when given an undefined value', () => {
    it('should throw a validation error when required', () => {
      expect(() => {
        Joi.attempt(undefined, Joi.str().required());
      }).to.throw(ValidationError, '"value" is required');
    });

    it('should return undefined when not required', () => {
      const result = Joi.attempt(undefined, Joi.str());
      expect(result).to.be.undefined;
    });

    it('should return a default value when specified', () => {
      const result = Joi.attempt(undefined, Joi.str().default('Foo'));
      expect(result).to.eq('Foo');
    });
  });

  describe('when given a null value', () => {
    it('should throw a validation error when required', () => {
      expect(() => {
        Joi.attempt(null, Joi.str().required());
      }).to.throw(ValidationError, '"value" is required');
    });

    it('should return null when not required', () => {
      const result = Joi.attempt(null, Joi.str());
      expect(result).to.be.null;
    });

    it('should return a default value when specified', () => {
      const result = Joi.attempt(null, Joi.str().default('Foo'));
      expect(result).to.eq('Foo');
    });
  });

  describe('when given an empty string value', () => {
    it('should throw a validation error when required', () => {
      expect(() => {
        Joi.attempt('', Joi.str().required());
      }).to.throw(ValidationError, '"value" is required');
    });

    it('should return null when not required', () => {
      const result = Joi.attempt('', Joi.str());
      expect(result).to.be.null;
    });

    it('should return a default value when specified', () => {
      const result = Joi.attempt('', Joi.str().default('Foo'));
      expect(result).to.eq('Foo');
    });
  });

  describe('when given a value that will resolve to an empty string', () => {
    it('should throw a validation error when required', () => {
      expect(() => {
        Joi.attempt('   ', Joi.str().required());
      }).to.throw(ValidationError, '"value" is required');
    });

    it('should return null when not required', () => {
      const result = Joi.attempt('   ', Joi.str());
      expect(result).to.be.null;
    });

    it('should return a default value when specified', () => {
      const result = Joi.attempt('   ', Joi.str().default('Foo'));
      expect(result).to.eq('Foo');
    });
  });

  describe('when given a non-empty string value', () => {
    it('should always return the trimmed value', () => {
      expect(Joi.attempt(' foo ', Joi.str())).to.eq('foo');
      expect(Joi.attempt('  bar   ', Joi.str())).to.eq('bar');
    });
  });

  describe('when given any other value', () => {
    it('should throw a validation error', () => {
      const values = [{}, [], 1, true, false, NaN, 0];
      values.forEach((value) => {
        expect(() => {
          Joi.attempt(value, Joi.str());
        }).to.throw(ValidationError, '"value" must be a string');
      });
    });
  });

  describe('when given a multi-line string', () => {
    it('should collapse into a single line by default', () => {
      expect(Joi.attempt(`
        Foo
        Bar
      `, Joi.str())).to.eq('Foo Bar');

      expect(Joi.attempt('\nFoo\r\nBar\n\nBaz\r\rDill\n', Joi.str())).to.eq('Foo Bar Baz Dill');
    });
    it('should preserve multi-line strings when multiline() is enabled', () => {
      expect(Joi.attempt('Foo\nBar', Joi.str().multiline())).to.eq('Foo\nBar');
    });
  });

  describe('when given a string with HTML encoded entities', () => {
    it('should decode all entities', () => {
      expect(Joi.attempt('&gt;foo&copy;&#162;a&#769;', Joi.str())).to.eq('>foo©¢á');
    });
  });

  describe('when given an HTML string', () => {
    it('should strip HTML tags by default', () => {
      expect(Joi.attempt('<body>foo</body>', Joi.str())).to.eq('foo');
      expect(Joi.attempt('<body><p><non-standard>foo</non-standard></p></body>', Joi.str())).to.eq('foo');
    });
    it('should preserve all HTML tags when html() is enabled', () => {
      expect(Joi.attempt('<body><p>foo</p></body>', Joi.str().html())).to.eq('<body><p>foo</p></body>');
    });
    it('should preserve HTML decoded tags when html() is enabled', () => {
      expect(Joi.attempt('<body>&lt;p&gt;foo</p></body>', Joi.str().html())).to.eq('<body><p>foo</p></body>');
    });
    it('should preserve only specific HTML tags when html() with tags are specified', () => {
      expect(Joi.attempt('<body><p><em><a href="/foo">foo</a></em></p><strong>bar</strong></body>', Joi.str().html({ tags: ['em', 'strong'] }))).to
        .eq('<em>foo</em><strong>bar</strong>');
    });
  });
});
