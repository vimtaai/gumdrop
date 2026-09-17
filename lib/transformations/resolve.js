import { FileReference } from "../references/reference.js";
import { Resource } from "../resources/resource.js";

/** @type {import("../utils/transformer.js").Transformation} */
export async function resolveReferences(resource, context) {
  const entries = await Promise.all(
    Object.entries(resource.data).map((entry) => resolveEntry(entry, context)),
  );

  return new Resource({
    data: Object.fromEntries(entries),
    content: resource.content,
  });
}

/** @param {import("../utils/transformer.js").TransformerContext} context */
async function resolveEntry([key, value], { loader, transformers }) {
  if (!(value instanceof FileReference)) {
    return [key, value];
  }

  const rawContent = await loader(value.path);

  if (value.type === "document") {
    const resource = new Resource({ content: rawContent });
    const resolved = await transformers.documentTransformer.transform(resource);

    return [key, resolved];
  }

  const resource = new Resource({ data: rawContent });
  const resolved = await transformers.dataTransformer.transform(resource);

  return [key, resolved.data];
}
