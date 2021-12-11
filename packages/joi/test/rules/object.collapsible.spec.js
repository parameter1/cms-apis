/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import Joi from 'joi';
import collapsible from '../../src/rules/object.collapsible.js';
import str from '../../src/types/str.js';

const Schema = Joi.extend(collapsible).extend(str);

describe('rules/object.collapsible', () => {
  it('should collapse to undefined (by default) when all keys are nullish', () => {
    expect(Joi.attempt({}, Schema.object().collapsible())).to.be.undefined;
  });
  it('should respect and use the default value when all keys are nullish', () => {
    expect(Joi.attempt({}, Schema.object().collapsible().default(null))).to.be.null;
    expect(Joi.attempt({}, Schema.object().collapsible().default({}))).to.deep.equal({});
  });
  it('should return the object as-is when at least one key is non-nullish', () => {
    expect(Joi.attempt({ foo: 1, bar: null }, Schema.object().collapsible()))
      .to.deep.equal({ foo: 1, bar: null });
  });
  it('should rollup on deep object values', () => {
    const schema = Schema.object({
      foo: Schema.object({
        a: Schema.any(),
        b: Schema.any(),
        c: Schema.str(),
      }).collapsible(),
    }).collapsible();

    expect(Schema.attempt({ foo: {} }, schema))
      .to.be.undefined;
    expect(Schema.attempt({ foo: { a: undefined, b: null, c: ' ' } }, schema))
      .to.be.undefined;
  });

  it('should respect deep object values', () => {
    const schema = Schema.object({
      foo: Schema.object({
        a: Schema.any(),
        b: Schema.any(),
        c: Schema.str(),
      }).collapsible(),
      bar: Schema.object({
        a: Schema.any(),
      }),
    }).collapsible();

    expect(Schema.attempt({ foo: {}, bar: { a: 1 } }, schema))
      .to.deep.equal({ bar: { a: 1 } });
  });
});
