import cdn from '../network/cdn'

let parser

async function createParser () {
  const MarkdownIt = await cdn.require('npm/markdown-it@8/dist/markdown-it.min.js', 'markdownit')
  const deflist = await cdn.require('npm/markdown-it-deflist@2/dist/markdown-it-deflist.min.js', 'markdownitDeflist')
  const anchor = await cdn.require('npm/markdown-it-anchor@5/index.js')
  const container = await cdn.require('npm/markdown-it-container@2/dist/markdown-it-container.min.js', 'markdownitContainer')
  const hljs = await cdn.require('gh/highlightjs/cdn-release@9/build/highlight.min.js', 'hljs')

  const markdownItConfig = {
    html: true,
    typographer: true,
    highlight: function (string, language) {
      if (language && hljs.getLanguage(language)) {
        try {
          return hljs.highlight(language, string).value
        } catch (__) {}
      }

      return ''
    }
  }

  const markdownItContainerConfig = {
    validate: () => true,
    render: function (tokens, idx) {
      if (tokens[idx].type === 'container__open') {
        return `<div ${tokens[idx].info.trim() ? `class="${tokens[idx].info.trim()}"` : ``}>`
      } else {
        return `</div>`
      }
    }
  }

  return MarkdownIt(markdownItConfig)
    .use(deflist)
    .use(anchor)
    .use(container, '', markdownItContainerConfig)
}

async function parse (response) {
  if (parser === undefined) {
    parser = await createParser()
  }

  return parser.render(await response.text())
}

export default parse
