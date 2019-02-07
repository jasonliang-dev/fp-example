import { identity, inspect } from './index.js';

export default class List {
  constructor(xs) {
    this.$value = xs;
  }

  inspect() {
    return `List(${inspect(this.$value)})`;
  }

  concat(x) {
    return new List(this.$value.concat(x));
  }

  // ----- Pointed List
  static of(xs) {
    return new List(xs);
  }

  // ----- Functor List
  map(fn) {
    return new List(this.$value.map(fn));
  }

  // ----- Traversable List
  sequence(of) {
    return this.traverse(of, identity);
  }

  traverse(of, fn) {
    return this.$value.reduce(
      (f, a) =>
        fn(a)
          .map(b => bs => bs.concat(b))
          .ap(f),
      of(new List([]))
    );
  }
}

// arrayToList :: [a] -> List a
export const arrayToList = arr => new List(arr);
