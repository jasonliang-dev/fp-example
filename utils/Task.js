import { compose, identity } from './index.js';

export default class Task {
  constructor(fork) {
    this.fork = fork;
  }

  static inspect() {
    return 'Task(?)';
  }

  static rejected(x) {
    // eslint-disable-next-line no-unused-vars
    return new Task((reject, _) => reject(x));
  }

  // ----- Pointed (Task a)
  static of(x) {
    return new Task((_, resolve) => resolve(x));
  }

  // ----- Functor (Task a)
  map(fn) {
    return new Task((reject, resolve) =>
      this.fork(
        reject,
        compose(
          resolve,
          fn
        )
      )
    );
  }

  // ----- Applicative (Task a)
  ap(f) {
    return this.chain(fn => f.map(fn));
  }

  // ----- Monad (Task a)
  chain(fn) {
    return new Task((reject, resolve) =>
      this.fork(reject, x => fn(x).fork(reject, resolve))
    );
  }

  join() {
    return this.chain(identity);
  }
}

// promiseToTask :: Promise a => Task _ a
export const promiseToTask = promise =>
  new Task((reject, result) => promise.then(result).catch(reject));
