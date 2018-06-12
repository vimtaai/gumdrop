import markdownIt from 'markdown-it';
import markdownItDeflist from 'markdown-it-deflist';
import markdownItContainer from 'markdown-it-container';

const containerConfig = {
  validate(name) {
    return name.trim().length;
  },
  render(tokens, idx) {
    if (tokens[idx].info.trim() !== '') {
      return `<div class="${tokens[idx].info.trim()}">`;
    } else {
      return `</div>`;
    }
  }
};

const markdownParser = markdownIt({ html: true })
  .use(markdownItDeflist)
  .use(markdownItContainer, '', containerConfig);

export const parser = {
  md: markdownParser.render.bind(markdownParser),
  json: JSON.parse
}