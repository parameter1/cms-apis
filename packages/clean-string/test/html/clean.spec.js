/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import clean from '../../src/html/clean.js';

const html = '<html><body><p><b>Bold <a href="">Link</a></b><i>Italic</i></p><p><em>Hello</em><br><strong>World</strong><br /></p><span><s>Sub</s><del>Strike</del></body></html>';

describe('html/clean', () => {
  it('should trim strings and return default value', () => {
    const values = [null, undefined, '   ', ''];
    values.forEach((value) => {
      expect(clean(value)).to.be.null;
      expect(clean(value, { defaultValue: '' })).to.equal('');
    });
  });
  it('should return default value when stripped tags result in empty value', () => {
    const result = clean('<p>  </p>   ', { allowedTags: false });
    expect(result).to.be.null;
  });
  it('should trim the result', () => {
    const result = clean('  <p> Foo  Bar </p>   ');
    expect(result).to.equal('<p> Foo  Bar </p>');
  });
  it('should encode/handle html entities', () => {
    ['<p>Hello & World</p>', '<p>Hello &amp; World</p>'].forEach((value) => {
      expect(clean(value)).to.equal('<p>Hello &amp; World</p>', { allowedTags: true });
      expect(clean(value)).to.equal('<p>Hello &amp; World</p>');
    });
    ['<p>&gt;foo&copy;&#162;a&#769;</p>', '<p>>foo©¢á</p>'].forEach((value) => {
      expect(clean(value)).to.equal('<p>&gt;foo©¢á</p>', { allowedTags: true });
      expect(clean(value)).to.equal('<p>&gt;foo©¢á</p>');
    });
  });
  it('should strip all tags when specified', () => {
    const result = clean(html, { allowedTags: false });
    expect(result).to.equal('Bold LinkItalicHelloWorldSubStrike');
  });
  it('should strip all tags except allowed tags', () => {
    const result = clean(html, { allowedTags: ['i', 'b', 'em', 'strong', 'del', 's'] });
    expect(result).to.equal('<b>Bold Link</b><i>Italic</i><em>Hello</em><strong>World</strong><s>Sub</s><del>Strike</del>');
  });
});
