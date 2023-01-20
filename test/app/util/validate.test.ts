import assert from 'assert';
import { notFound, notMatched } from '../../../app/util/validate';

describe('test app/util/validate', () => {
  it('test notMatched', () => {
    assert(notMatched(undefined, /[a-z]{3}/));
    assert(notMatched('1', /[a-z]{3}/));
    assert(!notMatched('abc', /[a-z]{3}/));
  });

  it('test notFound', () => {
    assert(notFound(undefined));
    assert(notFound(null));
    assert(notFound(''));
    assert(notFound([]));
    assert(notFound({}));
    assert(!notFound('abc'));
    assert(!notFound([ 'a' ]));
    assert(!notFound({ a: 'a' }));
  });
});
