// compose :: ((a -> b), (b -> c),  ..., (y -> z)) -> a -> z
export const compose = (...fns) => (...args) =>
  fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
export const curry = fn => {
  const arity = fn.length;

  const $curry = (...args) => {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }
    return fn.call(null, ...args);
  };

  return $curry;
};

// chain :: Monad m => (a -> m b) -> m a -> m b
export const chain = curry((fn, m) => m.chain(fn));

// filter :: (a -> Boolean) -> [a] -> [a]
export const filter = curry((fn, xs) => xs.filter(fn));

// identity :: a -> a
export const identity = x => x;

// inspect :: a -> a
export const inspect = x => {
  console.log(x); // eslint-disable-line no-console
  return x;
};

// map :: Functor f => (a -> b) -> f a -> f b
export const map = curry((fn, f) => f.map(fn));

// prop :: String -> Object -> a
export const prop = curry((key, obj) => obj[key]);

// propEq :: String -> a -> Object -> Boolean
export const propEq = curry((key, value, obj) => value === obj[key]);

// sequence :: (Applicative f, Traversable t) => (a -> f a) -> t (f a) -> f (t a)
export const sequence = curry((of, f) => f.sequence(of));

// then :: Promise a -> Promise b
export const then = curry((fn, promise) => promise.then(fn));

// traverse :: (Applicative f, Traversable t) => (a -> f a) -> (a -> f b) -> t a -> f (t b)
export const traverse = curry((of, fn, f) => f.traverse(of, fn));

// unsafePerformIO :: IO a -> a
export const unsafePerformIO = io => io.unsafePerformIO();
