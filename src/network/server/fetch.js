import { cache } from "./cache";

import { BadRequest } from "network/server/errors/bad-request";
import { NotFound } from "network/server/errors/not-found";

import { PathData } from "network/server/path";
import { parseYaml } from "network/server/parsers/yaml";
import { parseJson } from "network/server/parsers/json";
import { parseMarkdown } from "network/server/parsers/markdown";
import { ServerError } from "./errors/server-error";

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

    const rawData = await response.text();

    try {
      await resourceParsers[pathData.type](rawData);
    } catch (error) {
      throw new ServerError("Invalid content", error);
    }
  } catch (error) {
    return defaultValue || fetchResource(`errors/${error.httpErrorCode}.md`, error.message);
  }
}
