import fetchResource from '../network/fetch'

const regex = /\{\{(.+?)\}\}/g

function replacer (data, variableScope) {
  return function (_, path) {
    if (variableScope !== '') {
      if (!path.startsWith(`${variableScope}:`)) {
        return `{{${path}}}`
      }

      return getValueByPath(data, path.split(':')[1])
    } else {
      return getValueByPath(data, path)
    }
  }
}

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

export async function transformLoops (root, loopData = {}, loopVariable = '') {
  const node = root.querySelector('[data-each]')

  if (node === null) {
    return
  }

  const display = node.style.display || null
  const parent = node.parentNode
  const collection = node.getAttribute('data-each')

  let currentData = {}
  let variableScope = ''
  if (collection.match(regex)) {
    variableScope = collection.replace(regex, (_, name) => name)
    currentData = getValueByPath(loopData, variableScope) || []
  } else {
    currentData = await fetchResource('data', collection, 'json', [])
  }

  node.style.display = 'none'
  node.removeAttribute('data-each')

  for (const item of currentData) {
    const nodeClone = node.cloneNode(true)
    const attributes = Array.from(nodeClone.attributes)

    for (const attribute of attributes) {
      attribute.value = attribute.value.replace(regex, replacer(item, variableScope))
    }

    await transformLoops(nodeClone, item, variableScope)

    nodeClone.innerHTML = nodeClone.innerHTML.replace(regex, replacer(item, variableScope))
    nodeClone.style.display = display

    parent.insertBefore(nodeClone, node)
  }

  parent.removeChild(node)

  await transformLoops(root)
}

export default transformLoops
