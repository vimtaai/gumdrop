import fetchResource from '../network/fetch-resource'

const regex = /\{\{(.+?)\}\}/g

export async function transformLoops () {
  const loops = Array.from(document.querySelectorAll('[data-each]')).map((node) => ({
    node,
    dataFile: node.getAttribute('data-each'),
    display: node.style.display || null
  }))

  for (const loop of loops) {
    loop.node.style.display = 'none'
    loop.node.removeAttribute('data-each')
  }

  for (const loop of loops) {
    const data = await fetchResource('data', loop.dataFile, 'json', [])
    const parent = loop.node.parentNode

    for (const item of data) {
      const replacer = (_, property) => item[property.trim()]
      const elem = loop.node.cloneNode(true)
      const attributes = Array.from(elem.attributes)

      for (const attribute of attributes) {
        attribute.value = attribute.value.replace(regex, replacer)
      }

      elem.innerHTML = elem.innerHTML.replace(regex, replacer)
      elem.style.display = loop.display

      parent.insertBefore(elem, loop.node)
    }

    parent.removeChild(loop.node)
  }
}

export default transformLoops
