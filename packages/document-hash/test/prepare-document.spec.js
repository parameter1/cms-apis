/* eslint-disable import/no-extraneous-dependencies, no-unused-expressions */
import { ObjectId } from '@cms-apis/db';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import prepare from '../src/prepare-document.js';

describe('prepare-document', () => {
  it('should throw an error when no document is provided', () => {
    expect(() => {
      prepare();
    }).to.throw('No document was provided');
  });
  it('should throw an error when an _id cannot be extracted', () => {
    expect(() => {
      prepare({});
    }).to.throw('Unable to extract a document _id value');
  });
  it('should omit unspecified paths', () => {
    const v = { foo: 'bar', baz: 'dill' };
    const expected = { foo: 'bar' };
    const result = prepare({ _id: 1, v, o: { v } }, ['v.foo', 'o.v.foo']);
    expect(result).to.deep.equal({ _id: 1, v: expected, o: { v: expected } });
  });
  it('should omit null values', () => {
    const v = null;
    const result = prepare({ _id: 1, v, o: { v } }, ['v', 'o.v']);
    expect(result).to.deep.equal({ _id: 1 });
  });
  it('should omit undefined values', () => {
    const v = undefined;
    const result = prepare({ _id: 1, v, o: { v } }, ['v', 'o.v']);
    expect(result).to.deep.equal({ _id: 1 });
  });
  it('should omit empty arrays', () => {
    const v = [];
    const result = prepare({ _id: 1, v, o: { v } }, ['v', 'o.v']);
    expect(result).to.deep.equal({ _id: 1 });
  });
  it('should omit empty arrays with only null or undefined values', () => {
    const v = [null, undefined];
    const result = prepare({ _id: 1, v, o: { v } }, ['v', 'o.v']);
    expect(result).to.deep.equal({ _id: 1 });
  });
  it('should omit empty objects', () => {
    const v = {};
    const result = prepare({ _id: 1, v, o: { v } }, ['v', 'o.v']);
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
    ]).forEach((value) => {
      const r = prepare(value, ['v', 'foo']);
      expect(r).to.deep.equal(expected);
    });
  });
  it('should convert dates', () => {
    const v = new Date(1639508844407);
    const expected = 1639508844407;
    const result = prepare({ _id: 1, v, o: { v } }, ['v', 'o.v']);
    expect(result).to.deep.equal({ _id: 1, v: expected, o: { v: expected } });
  });
  it('should convert ObjectIds', () => {
    const v = new ObjectId('61b8ed6ef10eafd26b54b5c3');
    const expected = '61b8ed6ef10eafd26b54b5c3';
    const result = prepare({ _id: 1, v, o: { v } }, ['v', 'o.v']);
    expect(result).to.deep.equal({ _id: 1, v: expected, o: { v: expected } });
  });
  it('should convert ObjectId-like objects', () => {
    const v = { toString: () => '61b8ed6ef10eafd26b54b5c3' };
    const expected = '61b8ed6ef10eafd26b54b5c3';
    const result = prepare({ _id: 1, v, o: { v } }, ['v', 'o.v']);
    expect(result).to.deep.equal({ _id: 1, v: expected, o: { v: expected } });
  });
  it('should convert ObjectIds', () => {
    const v = new ObjectId('61b8ed6ef10eafd26b54b5c3');
    const expected = '61b8ed6ef10eafd26b54b5c3';
    const result = prepare({ _id: 1, v, o: { v } }, ['v', 'o.v']);
    expect(result).to.deep.equal({ _id: 1, v: expected, o: { v: expected } });
  });
  it('should preserve strings, numbers, and booleans', () => {
    const v = { str: 'str', num: 3, bool: true };
    const result = prepare({ _id: 1, v, o: { v } }, ['v', 'o.v']);
    expect(result).to.deep.equal({ _id: 1, v, o: { v } });
  });
  it('should sort arrays with numbers', () => {
    const v = [null, 3, 1, 5, 75, -1, undefined];
    const expected = [-1, 1, 3, 5, 75];
    const result = prepare({ _id: 1, v, o: { v } }, ['v', 'o.v']);
    expect(result).to.deep.equal({ _id: 1, v: expected, o: { v: expected } });
  });
  it('should sort arrays with strings', () => {
    const v = [null, '3', '1', '5', '75', '-1', undefined];
    const expected = ['-1', '1', '3', '5', '75'];
    const result = prepare({ _id: 1, v, o: { v } }, ['v', 'o.v']);
    expect(result).to.deep.equal({ _id: 1, v: expected, o: { v: expected } });
  });
  it('should sort arrays with booleans', () => {
    const v = [undefined, false, true, false, null];
    const expected = [false, false, true];
    const result = prepare({ _id: 1, v, o: { v } }, ['v', 'o.v']);
    expect(result).to.deep.equal({ _id: 1, v: expected, o: { v: expected } });
  });
  it('should sort arrays with objects', () => {
    const v = [
      { b: 1, a: 1 },
      { a: 1, b: 1 },
      { a: 3, b: -2 },
      { a: 2, b: -1 },
    ];
    const result = prepare({ _id: 1, v }, ['v']);
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
      prepare({ _id: 1, v: () => {} }, ['v']);
    }).to.throw('Unsupported Function type encountered for key v');
    expect(() => {
      prepare({ _id: 1, v: new Map() }, ['v']);
    }).to.throw('Unsupported Map type encountered for key v');
    expect(() => {
      prepare({ _id: 1, v: NaN }, ['v']);
    }).to.throw('Unsupported number type encountered for key v');
    expect(() => {
      prepare({ _id: 1, v: /foo/ }, ['v']);
    }).to.throw('Unsupported RegExp type encountered for key v');
  });
  it('should throw an error when non-string, number, or boolean arrays are encountered', () => {
    expect(() => {
      prepare({ _id: 1, v: [1, '2', false] }, ['v']);
    }).to.throw('Sorting non-scalar, non-plain object or mixed typed arrays is not supported');
  });
  it('should sort the keys', () => {
    const value = {
      _id: 1,
      c: 3,
      a: 1,
      b: { c: 1, a: 1 },
    };
    const result = prepare(value, ['c', 'a', 'b']);
    expect(result).to.deep.equal({
      _id: 1,
      a: 1,
      b: { a: 1, c: 1 },
      c: 3,
    });
  });
  it('should format _edge values', () => {
    const value = {
      _id: 1,
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
    };
    const result = prepare(value);
    expect(result).to.deep.equal({
      _edge: {
        parent: { _id: 2, depth: 1 },
        website: { _id: '5ed294c6c13a4626008b4568' },
      },
      _id: 1,
    });
  });
  it('should completely strip empty edges', () => {
    const value = {
      _id: 1,
      _edge: {
        foo: { node: { bar: 'baz' } },
        coverImage: null,
        logo: { node: null },
      },
    };
    const result = prepare(value);
    expect(result).to.deep.equal({ _id: 1 });
  });
  it('should format _connection values', () => {
    const value = {
      _id: 1,
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
    const result = prepare(value);
    expect(result).to.deep.equal({
      _connection: {
        ancestors: [
          { _id: 67013, depth: 2 },
          { _id: 67014, depth: 1 },
          { _id: 67015, depth: 1, foo: 'bar' },
        ],
        descendants: [
          { _id: '5ed294c6c13a4626008b4568', depth: 0 },
          { _id: '5ed294c6c13a4626008b4569', depth: 1 },
        ],
      },
      _id: 1,
    });
  });

  it('should handle the kitchen sink', () => {
    const result = prepare({
      _id: 1234,
      name: 'foo',
      oid: new ObjectId('61b8ed6ef10eafd26b54b5c3'),
      date: new Date(1639508844407),
      obj: { b: 1, a: 2, c: null },
      deep: {
        arr2: [3, 1, 5, null, 75, -1],
        arr1: [],
        arr3: [],
        o: {},
      },
      _import: { foo: 'bar' },
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
    }, [
      'date',
      'name',
      'body',
      'oid',
      'links.social',
      'links.website',
      'obj',
      'deep.arr2',
      'deep.arr1',
      'deep.o.foo',
      '_import',
    ]);
    expect(result).to.deep.equal({
      _connection: {
        ancestors: [
          { _id: 67013, depth: 2 },
          { _id: 67014, depth: 1 },
          { _id: 67015, depth: 1, foo: 'bar' },
        ],
        descendants: [
          { _id: '5ed294c6c13a4626008b4568', depth: 0 },
          { _id: '5ed294c6c13a4626008b4569', depth: 1 },
        ],
      },
      _edge: {
        parent: { _id: 2, depth: 1 },
        website: { _id: '5ed294c6c13a4626008b4568' },
      },
      _id: 1234,
      date: 1639508844407,
      deep: { arr2: [-1, 1, 3, 5, 75] },
      name: 'foo',
      obj: { a: 2, b: 1 },
      oid: '61b8ed6ef10eafd26b54b5c3',
    });
  });
});
