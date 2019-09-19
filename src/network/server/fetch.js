import { cache } from "./cache";

import { BadRequest } from "network/server/errors/bad-request";
import { NotFound } from "network/server/errors/not-found";

import { PathData } from "network/server/path";
import { parseYaml } from "network/server/parsers/yaml";
import { parseJson } from "network/server/parsers/json";
import { parseMarkdown } from "network/server/parsers/markdown";

const resourceParsers = { yaml: parseYaml, yml: parseYaml, json: parseJson, md: parseMarkdown };

export async function fetchResource(resourcePath, defaultValue) {
  if (resourcePath in cache) {
    return cache[resourcePath];
  }

  try {
    const pathData = new PathData(resourcePath, "md");

    if (pathData.type && !Object.keys(resourceParsers).includes(pathData.type)) {
      throw new BadRequest(`Invalid resource type "${pathData.type}"`);
    }

    const response = await window.fetch(pathData.path, { cache: "no-cache" });

    if (response.status === 404) {
      throw new NotFound();
    }

    return resourceParsers[pathData.type](await response.text());
  } catch (error) {
    return defaultValue || fetchResource(`errors/${error.httpErrorCode}.md`, error.message);
  }
}
