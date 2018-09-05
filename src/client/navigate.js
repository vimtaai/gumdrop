/* global location */

import fetchResource from '../network/fetch-resource'
import transformLoops from './transform-loops'

const root = document.querySelector('main')
const loader = root.innerHTML
const htmlParser = document.createElement('div')

export async function navigate () {
  const [page, fragment] = location.hash.replace(/^#\/?/, '').split('#')

  await (root.innerHTML = loader)
  htmlParser.innerHTML = await fetchResource('pages', (page || 'index'), 'md')
  await transformLoops(htmlParser)
  root.innerHTML = htmlParser.innerHTML

  if (fragment !== undefined) {
    const element = document.getElementById(fragment)

    if (element !== null) {
      element.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }
}

export default navigate
