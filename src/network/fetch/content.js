import { imports } from "../imports";

import { fetchResource } from "./resource";
import { fetchData } from "./data";
import { cache } from "../../client/cache";
import { parsers } from "../../parsers";
import { FileData } from "../../parsers/yaml";

export async function fetchContent(folder, name) {
  const frontMatterRegexp = /^---[ \t]*(\r?\n.*\r?\n|\r?\n)---[ \t]*\r\n(.*)$/s;

  if (cache.contains(folder, name)) {
    return cache.get(folder, name);
  }

  const content = await fetchResource(folder, name, "md");

  const result = frontMatterRegexp.exec(content);

  if (result === null) {
    return cache.set(folder, name, parsers.md(content));
  }

  const [_, front, template] = result;
  const context = await parsers.yaml(front);

  for (const field of Object.keys(context)) {
    if (context[field] instanceof FileData) {
      context[field] = await fetchData(context[field].file, context[field].extension);
    }
  }

  const Mustache = await imports.mustache;
  const parsedContent = Mustache.render(template, context);

  return cache.set(folder, name, await parsers.md(parsedContent));
}
