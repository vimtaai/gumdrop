/* global location */

import fetchResource from '../network/fetch-resource'
import transformLoops from './transform-loops'

const root = document.querySelector('main')
const loader = root.innerHTML

export async function navigate () {
  const page = (location.hash === '') ? 'index' : location.hash.substr(1)
  await (root.innerHTML = loader)
  root.innerHTML = await fetchResource('pages', page, 'md')
  await transformLoops()
}

export default navigate
