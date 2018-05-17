import parse from './parser';

const root = document.querySelector('main');
const cache = {};

async function fetchPage(page, cache) {
  if (cache.hasOwnProperty(page)) {
    return cache[page];
  }

  const response = await fetch('pages/' + page + '.md', { cache: 'no-cache' });

  if (response.ok) {
    return cache[page] = parse(await response.text());
  } else {
    return parse(await fetchErrorPage(response.status));
  }
}

async function fetchErrorPage(errorCode) {
  const response = await fetch('error/' + errorCode + '.md');
  return response.ok ? await response.text() : '';
}

async function load() {
  const page = (location.hash === '') ? 'index' : location.hash.substr(1);

  root.innerHTML = await fetchPage(page, cache);
}

export default load;