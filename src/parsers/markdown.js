// import { Mustache } from "mustache";

export function parseMarkdown(source) {
  return ExtraMark.render(source);
}
