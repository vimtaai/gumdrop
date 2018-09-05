import fetchResource from '../network/fetch-resource'

const regex = /\{\{(.+?)\}\}/g

function getValueByPath (obj, path) {
  if (obj.hasOwnProperty(path)) {
    return obj[path]
  }

  const next = path.substring(0, path.indexOf('.'))

  if (obj.hasOwnProperty(next) && typeof obj[next] === 'object') {
    return getValueByPath(obj[next], path.substring(path.indexOf('.') + 1))
  }

  return undefined
}

export async function transformLoops (root, loopData = {}) {
  const node = root.querySelector('[data-each]')

  if (node === null) {
    return
  }

  const display = node.style.display || null
  const parent = node.parentNode
  const name = node.getAttribute('data-each')
  const currentData = loopData[name] || await fetchResource('data', name, 'json', [])

  node.style.display = 'none'
  node.removeAttribute('data-each')

  for (const item of currentData) {
    const replacer = (_, path) => getValueByPath(item, path)
    const nodeClone = node.cloneNode(true)
    const attributes = Array.from(nodeClone.attributes)

    for (const attribute of attributes) {
      attribute.value = attribute.value.replace(regex, replacer)
    }

    await transformLoops(nodeClone, item)

    nodeClone.innerHTML = nodeClone.innerHTML.replace(regex, replacer)
    nodeClone.style.display = display

    parent.insertBefore(nodeClone, node)
  }

  parent.removeChild(node)

  await transformLoops(root)
}

export default transformLoops
