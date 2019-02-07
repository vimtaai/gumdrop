import { imports } from "./imports";
import { cache } from "../client/cache";
import { parsers } from "../parsers";

const frontMatterRegexp = /^---[ \t]*(\r?\n.*\r?\n|\r?\n)---[ \t]*\r\n(.*)$/s;

export async function fetchResource(folder, name, type, defaultValue) {
  const response = await window.fetch(`${folder}/${name}.${type}`, { cache: "no-cache" });

  if (!response.ok) {
    return defaultValue || (await fetchContent("errors", response.status));
  }

  return response.text();
}

export async function fetchData(name, type = "yaml") {
  if (cache.contains("data", name)) {
    return cache.get("data", name);
  }

  const data = await fetchResource("data", name, type, {});

  return cache.set("data", name, await parsers[type](data));
}

export async function fetchContent(folder, name) {
  if (cache.contains(folder, name)) {
    return cache.get(folder, name);
  }

  const Mustache = await imports.mustache;
  const content = await fetchResource(folder, name, "md", " ");

  const result = frontMatterRegexp.exec(content);

  if (result === null) {
    return cache.set(folder, name, parsers.md(content));
  }

  const [_, front, template] = result;
  const context = parsers.yaml(front);

  for (const field of Object.keys(context)) {
    if (context[field] instanceof Promise) {
      context[field] = await context[field];
    }
  }

  const parsedContent = Mustache.render(template, context);

  return cache.set(folder, name, await parsers.md(parsedContent));
}
