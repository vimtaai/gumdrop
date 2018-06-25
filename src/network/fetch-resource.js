import cache from '../client/cache';
import parsers from '../parsers/parsers';

export async function fetchResource(folder, name, type, defaultValue) {
  if (cache.contains(folder, name)) {
    return cache.get(folder, name);
  }

  const response = await fetch(`${folder}/${name}.${type}`, { cache: 'no-cache' });

  if (!response.ok) {
    return defaultValue; // TODO: display error page
  }

  cache.set(folder, name, await parsers[type](response));
  return cache.get(folder, name);
}

export default fetchResource;