import { Resource } from "../resources/resource.js";

/** @import { Transformation } from "../utils/transformer.js" */

/** @type {Transformation} */
export async function sanitizeContent(resource, { dependencies }) {
  return new Resource({
    data: resource.data,
    content: dependencies.sanitize(resource.content),
  });
}
