import markdownIt from 'markdown-it';
import markdownItDeflist from 'markdown-it-deflist';
import markdownItContainer from 'markdown-it-container';

const Markdown = markdownIt()
  .use(markdownItDeflist)
  .use(markdownItContainer, '', {
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
  });

export const parser = {
  md: Markdown.render.bind(Markdown),
  json: JSON.parse.bind(JSON)
}