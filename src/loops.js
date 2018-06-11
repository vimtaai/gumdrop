import { fetchResource } from './fetch';

export async function transformLoops() {
  const loops = document.querySelectorAll('[data-each]');
  
  for (const template of loops) {
    const collectionName = template.getAttribute('data-each');
    const collection = await fetchResource('collections', collectionName, 'json', []);

    template.removeAttribute('data-each');

    const parent = template.parentNode;
    
    for (const item of collection) {
      const elem = template.cloneNode(true);
      elem.innerHTML = elem.innerHTML.replace(/\{\{(.+?)\}\}/g, (_, property) => item[property]);
      parent.insertBefore(elem, template);
    }

    parent.removeChild(template);
  }
}