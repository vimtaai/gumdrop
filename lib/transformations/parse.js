import { parseYaml } from "../parsers/yaml.js";
import { Resource } from "../resources/resource.js";

/** @type {import("../utils/transformer.js").Transformation} */
export async function parseData(resource) {
  return new Resource({
    data: parseYaml(resource.data),
    content: resource.content,
  });
}
