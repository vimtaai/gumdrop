import { parseYaml } from "./yaml";

const frontMatterRegexp = /^---[ \t]*(\r?\n.*\r?\n|\r?\n)---[ \t]*\r\n(.*)$/s;

export async function parseFrontMatter(document) {
  const [, frontMatter, template] = frontMatterRegexp.exec(document);

  const context = await parseYaml(frontMatter);

  return { context, template };
}
