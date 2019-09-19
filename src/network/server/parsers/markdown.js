import { imports } from "network/remote/imports";

import { parseYaml } from "./yaml";
import { parseMustache } from "./mustache";

const frontMatterRegexp = /^---[ \t]*(\r?\n.*\r?\n|\r?\n)---[ \t]*\r?\n(.*)$/s;

export async function parseMarkdown(markdown) {
  const ExtraMark = await imports.extramark;

  const splitDocument = frontMatterRegexp.exec(markdown);

  const content = {};

  if (splitDocument === null) {
    content.context = null;
    content.template = markdown;
  } else {
    content.context = splitDocument[1];
    content.template = splitDocument[2];
  }

  if (content.context !== null) {
    content.context = await parseYaml(content.context);
    content.template = await parseMustache(content.template, content.context);
  }

  return ExtraMark.render(content.template);
}
