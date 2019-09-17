import { parseYaml } from "network/server/parsers/yaml";

const frontMatterRegexp = /^---[ \t]*(\r?\n.*\r?\n|\r?\n)---[ \t]*\r?\n(.*)$/s;

export async function parseFrontMatter(document) {
  const splitDocument = frontMatterRegexp.exec(document);

  if (splitDocument === null) {
    return { context: undefined, template: document };
  }

  const [, frontMatter, template] = splitDocument;
  const context = await parseYaml(frontMatter);

  return { context, template };
}
