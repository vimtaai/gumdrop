/* global fetch */
/* eslint no-eval: "off" */

export const cdn = {
  url: 'https://cdn.jsdelivr.net/',
  eval: window.eval.bind(window),
  require: async function (module, name = undefined) {
    window.module = {}
    const response = await fetch(this.url + module)

    if (!response.ok) {
      console.error(`Could not load module ${module} from CDN ${this.url} (${response.status})`)
      return
    }

    this.eval(`(function (module) {
      ${await response.text()}
      ${name !== undefined ? `module.exports = ${name};` : ``}
    })(window.module)`)

    return window.module.exports.default || window.module.exports
  }
}

export default cdn
