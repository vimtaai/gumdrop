import { renderMarkdown } from "../parsers/markdown.js";
import { Resource } from "../resources/resource.js";

/** @type {import("../utils/transformer.js").Transformation} */
export async function renderContent(resource) {
  return new Resource({
    data: resource.data,
    content: renderMarkdown(resource.content),
  });
}
