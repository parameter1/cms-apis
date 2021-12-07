import { describe, it } from 'mocha';
import { expect } from 'chai';
import slug from '../src/index.js';

describe('slug', () => {
  it('should be a function', () => expect(slug).to.a('function'));

  it('should convert null value to null', () => {
    expect(slug(null)).to.be.null;
  });

  it('should convert NaN to null', () =>{
    expect(slug(Number.NaN)).to.be.null;
    expect(slug(NaN)).to.be.null;
  });

  it('should convert undefined value to null', () => {
    expect(slug()).to.be.null;
    expect(slug(undefined)).to.be.null;
  });

  it('should convert empty string value to null', () => {
    expect(slug('')).to.be.null;
  });

  it('should throw an error when value is an object or an array', () => {
    expect(() => {
      slug({});
    }).to.throw();
    expect(() => {
      slug([]);
    }).to.throw();
  });

  it('should throw an error when value is a function', () => {
    expect(() => {
      slug(() => {});
    }).to.throw();
  });

  it('should convert strings with only spaces to null', () => {
    expect(slug(' ')).to.be.null;
    expect(slug('  ')).to.be.null;
  });

  it('should convert numbers to strings', () =>{
    expect(slug(1)).to.eq('1');
    expect(slug(0)).to.eq('0');
    expect(slug(-1)).to.eq('1');
  });

  it('should trim whitepace', () => {
    expect(slug('  foo   ')).to.eq('foo');
    expect(slug(' foo ')).to.eq('foo');
  });

  it('should not allow repetitive dashes', () => {
    expect(slug('foo--bar')).to.eq('foo-bar');
    expect(slug('Foo     Bar   /  Baz')).to.eq('foo-bar-baz');
  });

  it('should not allow leading and trailing dashes', () => {
    expect(slug('--Foo   Bar-- ')).to.eq('foo-bar');
    expect(slug(' - -Foo   Bar- - ')).to.eq('foo-bar');
  });

  it('should convert all dashes to null', () => {
    expect(slug('-')).to.be.null;
    expect(slug('--')).to.be.null;
    expect(slug('-- \\ / ----  -')).to.be.null;
  });

  it('should convert slashes to dashes', () => {
    expect(slug('Foo/Bar')).to.eq('foo-bar');
    expect(slug('Foo / Bar')).to.eq('foo-bar');
    expect(slug('Foo \\ Bar')).to.eq('foo-bar');
    expect(slug('Foo\\Bar')).to.eq('foo-bar');
    expect(slug('/Foo\\Bar/')).to.eq('foo-bar');
    expect(slug('Foo // Bar \\\\ Baz')).to.eq('foo-bar-baz');
    expect(slug('/// /// //')).to.be.null;
    expect(slug('\\\\\\')).to.be.null;
  });
  it('should convert & to and', () => {
    expect(slug('foo & bar')).to.eq('foo-and-bar');
    expect(slug('foo&bar')).to.eq('fooandbar');
    expect(slug('& foo  &  bar &')).to.eq('and-foo-and-bar-and');
  });
  it('should convert underscores to dashes', () => {
    expect(slug('foo_bar')).to.eq('foo-bar');
    expect(slug('_foo_  _ __bar_')).to.eq('foo-bar');
    expect(slug('____')).to.be.null;
  });
});
