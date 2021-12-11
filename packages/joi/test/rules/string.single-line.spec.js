/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import Joi from '../../src/index.js';

describe('rules/string.singleline', () => {
  it('should collapse into a single line when enabled', () => {
    expect(Joi.attempt(`
      Foo
      Bar
    `, Joi.string().singleline())).to.eq('Foo Bar');

    expect(Joi.attempt('\n  Foo\r\nBar  \n\nBaz\r\rDill\n', Joi.string().singleline())).to.eq('Foo Bar Baz Dill');
  });
  it('should preserve multi-line strings when not enabled', () => {
    expect(Joi.attempt('Foo\nBar', Joi.string())).to.eq('Foo\nBar');
  });
});
