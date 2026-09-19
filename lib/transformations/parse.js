import { parseYaml } from "../parsers/yaml.js";
import { Resource } from "../resources/resource.js";

/** @import { Transformation } from "../utils/transformer.js" */

/** @type {Transformation} */
export async function parseData(resource) {
  return new Resource({
    data: parseYaml(resource.data),
    content: resource.content,
  });
}
