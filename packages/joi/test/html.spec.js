/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import Joi from '../src/index.js';

const html = '<html><body><p><b>Bold <a href="">Link</a></b><i>Italic</i></p><p><em>Hello</em><br><strong>World</strong><br /></p><span><s>Sub</s><del>Strike</del></body></html>';

describe('types/html', () => {
  describe('full', () => {
    it('should preserve multi-line strings', () => {
      expect(Joi.attempt('Foo\nBar', Joi.fullHtml())).to.eq('Foo\nBar');
    });
    it('should decode all entities', () => {
      expect(Joi.attempt('&gt;foo&copy;&#162;a&#769;', Joi.fullHtml())).to.eq('>foo©¢á');
    });
    it('should preserve all HTML tags', () => {
      expect(Joi.attempt('<body>foo</body>', Joi.fullHtml())).to.eq('<body>foo</body>');
      expect(Joi.attempt('<body><p><non-standard>foo</non-standard></p></body>', Joi.fullHtml())).to.eq('<body><p><non-standard>foo</non-standard></p></body>');
      expect(Joi.attempt(html, Joi.fullHtml())).to.eq(html);
    });
  });
  describe('expanded', () => {
    it('should collapse into a single line', () => {
      expect(Joi.attempt(`
        Foo
        Bar
      `, Joi.expandedHtml())).to.eq('Foo Bar');
      expect(Joi.attempt('\nFoo\r\nBar\n\nBaz\r\rDill\n', Joi.expandedHtml())).to.eq('Foo Bar Baz Dill');
    });
    it('should decode all entities', () => {
      expect(Joi.attempt('&gt;foo&copy;&#162;a&#769;', Joi.expandedHtml())).to.eq('>foo©¢á');
    });
    it('should preserve only a subset of HTML tags', () => {
      expect(Joi.attempt(html, Joi.expandedHtml())).to.eq('<b>Bold <a href="">Link</a></b><i>Italic</i><em>Hello</em><br><strong>World</strong><br /><s>Sub</s><del>Strike</del>');
    });
  });
  describe('limited', () => {
    it('should collapse into a single line', () => {
      expect(Joi.attempt(`
        Foo
        Bar
      `, Joi.expandedHtml())).to.eq('Foo Bar');
      expect(Joi.attempt('\nFoo\r\nBar\n\nBaz\r\rDill\n', Joi.expandedHtml())).to.eq('Foo Bar Baz Dill');
    });
    it('should decode all entities', () => {
      expect(Joi.attempt('&gt;foo&copy;&#162;a&#769;', Joi.limitedHtml())).to.eq('>foo©¢á');
    });
    it('should preserve only a subset of HTML tags', () => {
      expect(Joi.attempt(html, Joi.limitedHtml())).to.eq('<b>Bold Link</b><i>Italic</i><em>Hello</em><strong>World</strong><s>Sub</s><del>Strike</del>');
    });
  });
});
