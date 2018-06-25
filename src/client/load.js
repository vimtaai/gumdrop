import fetchResource from '../network/fetch-resource';
import transformLoops from './transform-loops';

const root = document.querySelector('main');

export async function load() {
  const page = (location.hash === '') ? 'index' : location.hash.substr(1);
  root.innerHTML = await fetchResource('pages', page, 'md');
  await transformLoops();
}

export default load;