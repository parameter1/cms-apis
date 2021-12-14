/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import prepare from '../src/prepare-paths-to-hash.js';

describe('prepare-paths-to-hash', () => {
  it('should throw an error when the paths are not an array or Set', () => {
    expect(() => {
      prepare(null);
    }).to.throw('The document field paths to hash must either be an array or a set.');
  });
  it('should return an empty set when paths are undefined', () => {
    const result = prepare();
    expect(result).to.be.an.instanceOf(Set);
    expect(result.size).to.equal(0);
  });
  it('should allow an array of paths', () => {
    const result = prepare(['foo']);
    expect(result).to.be.an.instanceOf(Set);
    expect(result.size).to.equal(1);
    expect(result.has('foo')).to.equal(true);
  });
  it('should allow a Set of paths', () => {
    const result = prepare(new Set(['foo']));
    expect(result).to.be.an.instanceOf(Set);
    expect(result.size).to.equal(1);
    expect(result.has('foo')).to.equal(true);
  });
  it('should allow the _type field', () => {
    const result = prepare(new Set(['foo', '_type', '_id']));
    expect(result).to.be.an.instanceOf(Set);
    expect(result.size).to.equal(2);
    expect(result.has('_type')).to.equal(true);
    expect(result.has('foo')).to.equal(true);
    expect(result.has('_id')).to.equal(false);
  });
  it('should strip all other underscore fields', () => {
    const result = prepare(new Set(['foo', '_type', '_id', '_edge', '_connection', '_import', '__foo']));
    expect(result).to.be.an.instanceOf(Set);
    expect(result.size).to.equal(2);
    expect(result.has('_type')).to.equal(true);
    expect(result.has('foo')).to.equal(true);
    expect(result.has('_id')).to.equal(false);
    expect(result.has('_edge')).to.equal(false);
    expect(result.has('_connection')).to.equal(false);
    expect(result.has('_import')).to.equal(false);
    expect(result.has('__foo')).to.equal(false);
  });
});
