/* global hljs, markdownitDeflist, markdownitContainer */

let md;

const markdownItConfig = {
  html: true,
  typographer: true,
  highlight (string, language) {
    if (language && hljs.getLanguage(language)) {
      try {
        return hljs.highlight(language, string).value;
      } catch (__) {}
    }

    return '';
  }
};

const markdownItContainerConfig = {
  validate (name) {
    return name.trim().length;
  },
  render (tokens, idx) {
    if (tokens[idx].info.trim() !== '') {
      return `<div class="${tokens[idx].info.trim()}">`;
    } else {
      return `</div>`;
    }
  }
};

async function parse (response) {
  if (md === undefined) {
    md = window.markdownit(markdownItConfig)
      .use(markdownitDeflist)
      .use(markdownitContainer, '', markdownItContainerConfig);
  }

  return md.render(await response.text());
}

export default parse;
