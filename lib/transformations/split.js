import { Resource } from "../resources/resource.js";

const FRONTMATTER_PATTERN = /^---\n(?<data>[\s\S]*?)\n---\n?(?<content>[\s\S]*)/;

/** @import { Transformation } from "../utils/transformer.js" */

/** @type {Transformation} */
export async function splitFrontmatter(resource) {
  const match = resource.content.match(FRONTMATTER_PATTERN);

  return new Resource({
    data: match?.groups?.data ?? "",
    content: match?.groups?.content ?? resource.content,
    path: resource.path,
  });
}
