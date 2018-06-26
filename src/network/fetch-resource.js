/* global fetch */

import cache from '../client/cache';
import parsers from '../parsers/parsers';

export async function fetchResource (folder, name, type, defaultValue) {
  if (cache.contains(folder, name)) {
    return cache.get(folder, name);
  }

  const response = await fetch(`${folder}/${name}.${type}`, { cache: 'no-cache' });

  if (!response.ok) {
    return defaultValue || fetchResource('errors', response.status, 'md', ' ');
  }

  return cache.set(folder, name, await parsers[type](response));
}

export default fetchResource;
