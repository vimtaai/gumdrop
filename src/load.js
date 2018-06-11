import { fetchResource } from './fetch';

const root = document.querySelector('main');

export async function loadPage() {
  const page = (location.hash === '') ? 'index' : location.hash.substr(1);

  root.innerHTML = await fetchResource('pages', page, 'md');
}