import { parseYaml } from "../parsers/yaml.js";
import { Resource } from "../resources/resource.js";
import { isDataMapping } from "../utils/data.js";

/** @import { Transformation } from "../utils/transformer.js" */

/** @type {Transformation} */
export async function parseFrontmatter(resource) {
  const data = parseYaml(resource.data);

  if (!isDataMapping(data)) {
    const parsedType = data?.constructor?.name ?? data;
    throw new Error(`Frontmatter must be a mapping of fields, got ${parsedType}`);
  }

  return new Resource({
    data,
    content: resource.content,
    path: resource.path,
  });
}

/** @type {Transformation} */
export async function parseData(resource) {
  return new Resource({
    data: parseYaml(resource.data),
    content: resource.content,
    path: resource.path,
  });
}
