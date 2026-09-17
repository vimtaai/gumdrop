import { Resource } from "../resources/resource.js";

/** @type {import("../utils/transformer.js").Transformation} */
export async function sanitizeContent(resource, { sanitizer }) {
  return new Resource({
    data: resource.data,
    content: sanitizer(resource.content),
  });
}
