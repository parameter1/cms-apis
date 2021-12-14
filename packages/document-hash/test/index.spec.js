/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { describe, it } from 'mocha';
import { expect } from 'chai';
import { ObjectId } from '@cms-apis/db';
import hash from '../src/index.js';

describe('index', () => {
  it('should consistently hash empty values', () => {
    const expected = 'b9ec1d10d3c61093e645c8dd4e23368d12e44fab';
    ([
      { _id: 1, v: null, foo: 'bar' },
      { _id: 1, v: undefined, foo: 'bar' },
      { _id: 1, v: [], foo: 'bar' },
      { _id: 1, v: [null, undefined, {}], foo: 'bar' },
      { _id: 1, v: {}, foo: 'bar' },
    ]).forEach((value) => {
      const r = hash(value, ['v', 'foo']);
      expect(r).to.equal(expected);
    });
  });
  it('should consistently hash regardless of key order', () => {
    const expected = 'd555a82800a107581320ecd7a943bd6633b1a176';
    const v1 = {
      _id: 1,
      c: 3,
      a: 1,
      b: { c: 1, a: 1 },
      e: [
        { b: 1, a: 1 },
        { a: 1, b: 1 },
        { a: 3, b: -2 },
        { a: 2, b: -1, foo: { bar: [] } },
        { foo: undefined },
      ],
      d: [4, 3, 1],
      _edge: {
        foo: { node: { bar: 'baz' } },
        coverImage: null,
        logo: { node: null },
        website: {
          node: { _id: new ObjectId('5ed294c6c13a4626008b4568'), name: 'Sandbox' },
        },
        parent: {
          depth: 1,
          node: { _id: 2, name: 'Foo' },
        },
      },
      _connection: {
        a: { node: { bar: 'baz' } },
        b: null,
        c: [],
        d: [{}],
        e: [{ node: {} }],

        ancestors: [
          { depth: 1, foo: 'bar', node: { _id: 67015, name: 'Foo' } },
          { depth: 1, node: { _id: 67014, name: 'Bar' } },
          { depth: 2, node: { _id: 67013, name: 'Baz' } },
        ],
        descendants: [
          { depth: 1, node: { _id: new ObjectId('5ed294c6c13a4626008b4569'), name: 'Dill' } },
          { depth: 0, node: { _id: new ObjectId('5ed294c6c13a4626008b4568'), name: 'Dill' } },
        ],
      },
    };
    const v2 = {
      c: 3,
      _id: 1,
      e: [
        { b: 1, a: 1 },
        { b: -1, a: 2 },
        { a: 1, b: 1 },
        { foo: undefined },
        { b: -2, a: 3 },
      ],
      _edge: {
        website: {
          node: { name: 'Sandbox', _id: new ObjectId('5ed294c6c13a4626008b4568') },
        },
        coverImage: null,
        parent: {
          node: { _id: 2, name: 'Foo' },
          depth: 1,
        },
      },
      b: { c: 1, z: 4, a: 1 },
      d: [4, 1, 3],
      a: 1,
      foo: 'bar',
      _connection: {
        a: { node: { bar: 'baz' } },
        e: [{ node: {} }],

        ancestors: [
          {},
          { depth: 2, node: { name: 'Baz', _id: 67013 } },
          { depth: 1, foo: 'bar', node: { _id: 67015, name: 'Foo' } },
          { depth: 1, node: { _id: 67014, name: 'Bar' } },
        ],
        descendants: [
          { depth: 0, node: { _id: new ObjectId('5ed294c6c13a4626008b4568'), name: 'Dill' } },
          { depth: 1, node: { _id: new ObjectId('5ed294c6c13a4626008b4569'), name: 'Dill' } },
          null,
        ],
      },
    };

    const r1 = hash(v1, ['c', 'a', 'e', 'b', 'd']);
    expect(r1).to.equal(expected);

    const r2 = hash(v2, ['e', 'b.c', 'b.a', 'a', 'c', 'd']);
    expect(r2).to.equal(expected);
  });
  it('should be type aware', () => {
    const r1 = hash({ _id: 1, a: 1 }, ['a']);
    const r2 = hash({ _id: 1, a: '1' }, ['a']);
    expect(r1).to.not.equal(r2);

    const r3 = hash({ _id: 1, a: true }, ['a']);
    const r4 = hash({ _id: 1, a: 'true' }, ['a']);
    expect(r3).to.not.equal(r4);
  });
});
