import { renderMarkdown } from "../parsers/markdown.js";
import { Resource } from "../resources/resource.js";

/** @import { Transformation } from "../utils/transformer.js" */

const HTML_EXTENSION = "html";

/** @type {Transformation} */
export async function renderContent(resource) {
  if (resource.extension === HTML_EXTENSION) {
    return resource;
  }

  return new Resource({
    data: resource.data,
    content: renderMarkdown(resource.content),
    path: resource.path,
  });
}
