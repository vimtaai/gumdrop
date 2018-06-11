import { parser } from './parser';

const cache = {};

async function fetchErrorPage(errorCode) {
  const response = await fetch('error/' + errorCode + '.md');
  return response.ok ? await response.text() : '';
}

export async function fetchResource(folder, name, type, defaultValue) {
  if (!cache.hasOwnProperty(folder)) {
    cache[folder] = {};
  }

  if (cache[folder].hasOwnProperty(name)) {
    return cache[folder][name];
  }

  const response = await fetch(folder + '/' + name + '.' + type, { cache: 'no-cache' });

  if (!response.ok) {
    return defaultValue || parser.md(await fetchErrorPage(response.status));
  }

  return cache[folder][name] = parser[type](await response.text());
}
