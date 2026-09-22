import { FileReference } from "../references/reference.js";
import { Resource } from "../resources/resource.js";
import { getDirectory, resolvePath } from "../utils/path.js";

/** @import { Transformation, TransformerContext } from "../utils/transformer.js" */

const ROOT_RELATIVE_PREFIX = "/";

/** @type {Transformation} */
export async function resolveReferences(resource, context) {
  const base = getDirectory(resource.path);
  const entries = await Promise.all(
    Object.entries(resource.data).map((entry) => resolveEntry(entry, base, context)),
  );

  return new Resource({
    data: Object.fromEntries(entries),
    content: resource.content,
    path: resource.path,
  });
}

/**
 * @param {string} base
 * @param {TransformerContext} context
 */
async function resolveEntry([key, value], base, { dependencies, transformers }) {
  if (!(value instanceof FileReference)) {
    return [key, value];
  }

  const origin = value.path.startsWith(ROOT_RELATIVE_PREFIX) ? dependencies.root : base;
  const path = resolvePath(origin, value.path);
  const rawContent = await dependencies.loader.load(path);

  if (value.type === "document") {
    const resource = new Resource({ content: rawContent, path });
    const resolved = await transformers.documentTransformer.transform(resource);

    return [key, resolved];
  }

  const resource = new Resource({ data: rawContent, path });
  const resolved = await transformers.dataTransformer.transform(resource);

  return [key, resolved.data];
}
