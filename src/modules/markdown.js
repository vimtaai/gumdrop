import markdownit from "markdown-it";

const parser = markdownit("commonmark");

export function parseMarkdown(source) {
  return parser.render(source);
}
