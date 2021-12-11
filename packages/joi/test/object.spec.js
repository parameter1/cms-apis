/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import Joi from '../src/index.js';

describe('types/object', () => {
  describe('collapsible', () => {
    it('should collapse to undefined (by default) when all keys are nullish', () => {
      expect(Joi.attempt({}, Joi.object().collapsible())).to.be.undefined;
    });
    it('should respect and use the default value when all keys are nullish', () => {
      expect(Joi.attempt({}, Joi.object().collapsible().default(null))).to.be.null;
      expect(Joi.attempt({}, Joi.object().collapsible().default({}))).to.deep.equal({});
    });
    it('should return the object as-is when at least one key is non-nullish', () => {
      expect(Joi.attempt({ foo: 1, bar: null }, Joi.object().collapsible()))
        .to.deep.equal({ foo: 1, bar: null });
    });
    it('should rollup on deep object values', () => {
      const schema = Joi.object({
        foo: Joi.object({
          a: Joi.any(),
          b: Joi.any(),
          c: Joi.string(),
        }).collapsible(),
      }).collapsible();

      expect(Joi.attempt({ foo: {} }, schema))
        .to.be.undefined;
      expect(Joi.attempt({ foo: { a: undefined, b: null, c: ' ' } }, schema))
        .to.be.undefined;
    });

    it('should respect deep object values', () => {
      const schema = Joi.object({
        foo: Joi.object({
          a: Joi.any(),
          b: Joi.any(),
          c: Joi.string(),
        }).collapsible(),
        bar: Joi.object({
          a: Joi.any(),
        }),
      }).collapsible();

      expect(Joi.attempt({ foo: {}, bar: { a: 1 } }, schema))
        .to.deep.equal({ bar: { a: 1 } });
    });
  });
});
