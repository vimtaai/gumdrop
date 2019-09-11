import { imports } from "network/remote/imports";
import { cache } from "network/server/cache";
import { parseMarkdown } from "network/server/parsers/markdown";
import { parseFrontMatter } from "network/server/parsers/front-matter";

import { fetchResource } from "./fetch/resource";
import { fetchFrontMatterData } from "./fetch/front-matter";

export async function fetchContent(folder, name) {
  if (cache.contains(folder, name)) {
    return cache.get(folder, name);
  }

  const document = await fetchResource(folder, name, "md");
  const { context, template } = await parseFrontMatter(document);

  if (context === undefined) {
    return cache.set(folder, name, await parseMarkdown(document));
  }

  await fetchFrontMatterData(context);

  const Mustache = await imports["mustache"];
  const renderedTemplate = Mustache.render(template, context);

  return cache.set(folder, name, await parseMarkdown(renderedTemplate));
}
