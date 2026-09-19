import { renderMarkdown } from "../parsers/markdown.js";
import { Resource } from "../resources/resource.js";

/** @import { Transformation } from "../utils/transformer.js" */

/** @type {Transformation} */
export async function renderContent(resource) {
  return new Resource({
    data: resource.data,
    content: renderMarkdown(resource.content),
  });
}
