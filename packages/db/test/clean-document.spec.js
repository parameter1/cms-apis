/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { ObjectId } from '@cms-apis/mongodb';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import clean from '../src/clean-document.js';

describe('clean-document', () => {
  it('should omit null values', () => {
    const v = null;
    const result = clean({ _id: 1, v, o: { v } });
    expect(result).to.deep.equal({ _id: 1 });
  });
  it('should omit undefined values', () => {
    const v = undefined;
    const result = clean({ _id: 1, v, o: { v } });
    expect(result).to.deep.equal({ _id: 1 });
  });
  it('should omit empty arrays', () => {
    const v = [];
    const result = clean({ _id: 1, v, o: { v } });
    expect(result).to.deep.equal({ _id: 1 });
  });
  it('should omit empty arrays with only null, undefined or empty object values', () => {
    const v = [null, undefined, {}];
    const result = clean({ _id: 1, v, o: { v } });
    expect(result).to.deep.equal({ _id: 1 });
  });
  it('should omit empty objects', () => {
    const v = {};
    const result = clean({ _id: 1, v, o: { v } });
    expect(result).to.deep.equal({ _id: 1 });
  });
  it('should omit empty values consistently', () => {
    const expected = { _id: 1, foo: 'bar' };
    ([
      { _id: 1, v: null, foo: 'bar' },
      { _id: 1, v: undefined, foo: 'bar' },
      { _id: 1, v: [], foo: 'bar' },
      { _id: 1, v: [null, undefined], foo: 'bar' },
      { _id: 1, v: {}, foo: 'bar' },
      { _id: 1, v: { o: {}, a: [], b: null }, foo: 'bar' },
    ]).forEach((value) => {
      const r = clean(value);
      expect(r).to.deep.equal(expected);
    });
  });
  it('should handle dates', () => {
    const v = new Date(1639508844407);
    const expected = new Date(1639508844407);
    const result = clean({ _id: 1, v, o: { v } });
    expect(result).to.deep.equal({ _id: 1, v: expected, o: { v: expected } });
  });
  it('should handle ObjectIds', () => {
    const v = new ObjectId('61b8ed6ef10eafd26b54b5c3');
    const expected = new ObjectId('61b8ed6ef10eafd26b54b5c3');
    const result = clean({ _id: 1, v, o: { v } });
    expect(result).to.deep.equal({ _id: 1, v: expected, o: { v: expected } });
  });
  it('should preserve strings, numbers, and booleans', () => {
    const v = { str: 'str', num: 3, bool: true };
    const result = clean({ _id: 1, v, o: { v } });
    expect(result).to.deep.equal({ _id: 1, v, o: { v } });
  });
  it('should sort arrays with numbers', () => {
    const v = [null, 3, 1, 5, 75, -1, undefined];
    const expected = [-1, 1, 3, 5, 75];
    const result = clean({ _id: 1, v, o: { v } });
    expect(result).to.deep.equal({ _id: 1, v: expected, o: { v: expected } });
  });
  it('should sort arrays with strings', () => {
    const v = [null, '3', '1', '5', '75', '-1', undefined];
    const expected = ['-1', '1', '3', '5', '75'];
    const result = clean({ _id: 1, v, o: { v } });
    expect(result).to.deep.equal({ _id: 1, v: expected, o: { v: expected } });
  });
  it('should sort arrays with booleans', () => {
    const v = [undefined, false, true, false, null];
    const expected = [false, false, true];
    const result = clean({ _id: 1, v, o: { v } });
    expect(result).to.deep.equal({ _id: 1, v: expected, o: { v: expected } });
  });
  it('should sort arrays with objects', () => {
    const v = [
      { b: 1, a: 1 },
      { a: 1, b: 1 },
      { a: 3, b: -2 },
      { a: 2, b: -1 },
      { foo: undefined },
    ];
    const result = clean({ _id: 1, v });
    expect(result).to.deep.equal({
      _id: 1,
      v: [
        { a: 1, b: 1 },
        { a: 1, b: 1 },
        { a: 2, b: -1 },
        { a: 3, b: -2 },
      ],
    });
  });
  it('should throw an error when a non-supported type is encountered', () => {
    expect(() => {
      clean({ _id: 1, v: () => {} });
    }).to.throw('Unsupported Function type encountered for key v');
    expect(() => {
      clean({ _id: 1, v: new Map() });
    }).to.throw('Unsupported Map type encountered for key v');
    expect(() => {
      clean({ _id: 1, v: NaN });
    }).to.throw('Unsupported number type encountered for key v');
    expect(() => {
      clean({ _id: 1, v: /foo/ });
    }).to.throw('Unsupported RegExp type encountered for key v');
  });
  it('should throw an error when non-string, number, or boolean arrays are encountered', () => {
    expect(() => {
      clean({ _id: 1, v: [1, '2', false] });
    }).to.throw('Sorting non-scalar, non-plain object or mixed typed arrays is not supported');
  });
  it('should sort the keys', () => {
    const value = {
      _id: 1,
      c: 3,
      a: 1,
      b: { c: 1, a: 1 },
    };
    const result = clean(value);
    expect(result).to.deep.equal({
      _id: 1,
      a: 1,
      b: { a: 1, c: 1 },
      c: 3,
    });
  });
  it('should support a custom mapper', () => {
    const value = {
      _id: 1,
      c: 3,
      a: 1,
      b: { c: 1, a: 1 },
    };
    const result = clean(value, {
      mapper: (key) => {
        if (key === '_id') return undefined;
        return [key, true];
      },
    });
    expect(result).to.deep.equal({
      _id: 1,
      a: true,
      b: true,
      c: true,
    });
  });
});
