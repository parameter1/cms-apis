/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { ObjectId } from '@cms-apis/db';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import hash from '../src/index.js';

describe('index', () => {
  it('should consistently hash empty values', () => {
    const expected = 'b9ec1d10d3c61093e645c8dd4e23368d12e44fab';
    ([
      { _id: 1, v: null, foo: 'bar' },
      { _id: 1, v: undefined, foo: 'bar' },
      { _id: 1, v: [], foo: 'bar' },
      { _id: 1, v: [null, undefined], foo: 'bar' },
      { _id: 1, v: {}, foo: 'bar' },
    ]).forEach((value) => {
      const r = hash(value, ['v', 'foo']);
      expect(r).to.equal(expected);
    });
  });
  it('should consistently hash regardless of key order', () => {
    const expected = '23bc6ddc93df7df0563d48b8c0b6f930b300cc91';
    const v1 = {
      _id: 1,
      c: 3,
      a: 1,
      b: { c: 1, a: 1 },
    };
    const v2 = {
      c: 3,
      _id: 1,
      b: { c: 1, z: 4, a: 1 },
      a: 1,
      foo: 'bar',
    };
    const r1 = hash(v1, ['c', 'a', 'b']);
    expect(r1).to.equal(expected);

    const r2 = hash(v2, ['b.c', 'b.a', 'a', 'c']);
    expect(r2).to.equal(expected);
  });
});
