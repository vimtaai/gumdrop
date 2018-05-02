import parse from './parser';

const root = document.querySelector('main');
const cache = {};

export default async function load() {
  const page = (location.hash === '') ? 'index' : location.hash.substr(1);

  let content;

  if (!cache.hasOwnProperty(page)) {
    const pageFetchResponse = await fetch('pages/' + page + '.md', {
      cache: 'no-cache'
    });

    if (!pageFetchResponse.ok) {
      const errorFetchResponse =  await fetch('error/' + pageFetchResponse.status + '.md');
      if (errorFetchResponse.ok) {
        content = parse(await errorFetchResponse.text());
      }
    } else {
      content = cache[page] = parse(await pageFetchResponse.text());
    }
  }

  root.innerHTML = content || cache[page] || '';
}
