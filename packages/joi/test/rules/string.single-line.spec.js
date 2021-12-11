/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import Joi from 'joi';
import stringSingleline from '../../src/rules/string.singleline.js';

const Schema = Joi.extend(stringSingleline);

describe('rules/string.singleline', () => {
  it('should collapse into a single line when enabled', () => {
    expect(Joi.attempt(`
      Foo
      Bar
    `, Schema.string().singleline())).to.eq('Foo Bar');

    expect(Joi.attempt('\n  Foo\r\nBar  \n\nBaz\r\rDill\n', Schema.string().singleline())).to.eq('Foo Bar Baz Dill');
  });
  it('should preserve multi-line strings when not enabled', () => {
    expect(Joi.attempt('Foo\nBar', Schema.string())).to.eq('Foo\nBar');
  });
});
