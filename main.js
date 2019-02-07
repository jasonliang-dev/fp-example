import IO from './utils/IO.js';
import Task from './utils/Task.js';
import { arrayToList } from './utils/List.js';
import {
  chain,
  compose,
  curry,
  map,
  prop,
  inspect,
  traverse,
  unsafePerformIO,
} from './utils/index.js';

// -- Pointfree utilities --------------------------------------------

// img :: String -> Image
const img = src => {
  const image = new Image();
  image.src = src;
  return image;
};

// querySelector :: String -> HtmlElement -> IO HtmlElement
const querySelector = curry(
  (selection, element) => new IO(() => element.querySelector(selection))
);

// appendChild :: HtmlElement -> HtmlElement -> IO HtmlElement
const appendChild = curry(
  (child, element) => new IO(() => element.appendChild(child))
);

// -- Application code -----------------------------------------------

// fetchJSON :: String -> Object -> Task Error JSON
const fetchJSON = (url, params) =>
  new Task((reject, result) =>
    fetch(url, params)
      .then(x => x.json())
      .then(result)
      .catch(reject)
  );

// addImageToMain :: Image -> IO Image
const addImageToMain = image =>
  compose(
    chain(appendChild(image)),
    chain(querySelector('main')),
    IO.of
  )(document);

// addUrlToMain :: String -> IO Image
const addUrlToMain = compose(
  addImageToMain,
  img
);

// main :: String -> Task Error (IO (List Image))
const main = compose(
  map(traverse(IO.of, addUrlToMain)),
  map(arrayToList),
  map(prop('urls')),
  fetchJSON
);

// -- Impure calling code --------------------------------------------

main('./data.json').fork(inspect, unsafePerformIO);
