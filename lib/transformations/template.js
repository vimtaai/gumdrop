import { renderLiquid } from "../parsers/liquid.js";
import { Resource } from "../resources/resource.js";

/** @import { Transformation } from "../utils/transformer.js" */

/** @type {Transformation} */
export async function renderTemplate(resource) {
  return new Resource({
    data: resource.data,
    content: await renderLiquid(resource.content, resource.data),
    path: resource.path,
  });
}
