/* global location */

import fetchResource from '../network/fetch'
import transformLoops from './transform-loops'

const root = document.querySelector('main')
const loader = root.innerHTML
const htmlParser = document.createElement('div')
const timeUntilLoader = 500

export async function navigate () {
  const [page, fragment] = location.hash.replace(/^#!?\/?/, '').split('#')

  const timer = window.setTimeout(async function () {
    await (root.innerHTML = loader)
  }, timeUntilLoader)
  htmlParser.innerHTML = await fetchResource('pages', (page || 'index'), 'md')
  await transformLoops(htmlParser)
  root.innerHTML = htmlParser.innerHTML
  window.clearTimeout(timer)

  if (fragment !== undefined) {
    const element = document.getElementById(fragment)

    if (element !== null) {
      element.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }
}

export default navigate
