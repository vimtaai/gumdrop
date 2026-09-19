import { Resource } from "../resources/resource.js";

/** @import { Transformation } from "../utils/transformer.js" */

/** @type {Transformation} */
export async function sanitizeContent(resource, { sanitizer }) {
  return new Resource({
    data: resource.data,
    content: sanitizer(resource.content),
  });
}
