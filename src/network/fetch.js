import { cache } from "../client/cache";
import { parsers } from "../parsers";

const frontMatterRegexp = /^---[ \t]*(\r?\n.*\r?\n|\r?\n)---[ \t]*\r\n(.*)$/s;

export async function fetchResource(folder, name, type, defaultValue) {
  const response = await window.fetch(`${folder}/${name}.${type}`, { cache: "no-cache" });

  if (!response.ok) {
    return defaultValue || (await fetchContent("errors", response.status, "md", " "));
  }

  return response.text();
}

export async function fetchData(name, type) {
  if (cache.contains("data", name)) {
    return cache.get("data", name);
  }

  const data = await fetchResource("data", name, type);

  return cache.set("data", name, parsers[type](data));
}

export async function fetchContent(folder, name, type = "") {
  if (cache.contains(folder, name)) {
    return cache.get(folder, name);
  }

  const content = await fetchResource(folder, name, type, " ");

  const result = frontMatterRegexp.exec(content);

  if (result === null) {
    return cache.set(folder, name, parsers[type](content));
  }

  const [_, front, template] = result;
  const { data: dataSource, ...context } = parsers.yaml(front);

  if (dataSource !== undefined) {
    context[dataSource] = await fetchData(dataSource, "json");
  }

  const parsedContent = Mustache.render(template, context);

  return cache.set(folder, name, parsers[type](parsedContent));
}
