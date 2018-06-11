import { fetchResource } from './fetch';

export async function transformLoops() {
  const loops = document.querySelectorAll('[data-each]');
  
  for (const template of loops) {
    const fileName = template.getAttribute('data-each');
    const data = await fetchResource('data', fileName, 'json', []);

    template.removeAttribute('data-each');

    const parent = template.parentNode;
    
    for (const item of data) {
      const elem = template.cloneNode(true);
      elem.innerHTML = elem.innerHTML.replace(/\{\{(.+?)\}\}/g, (_, property) => item[property]);
      parent.insertBefore(elem, template);
    }

    parent.removeChild(template);
  }
}