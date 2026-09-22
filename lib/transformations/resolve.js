import { FileReference } from "../references/reference.js";
import { Resource } from "../resources/resource.js";
import { resolvePath } from "../utils/path.js";
import { Promise_allKeyed } from "../utils/promise.js";

/** @import { Transformation, TransformerContext } from "../utils/transformer.js" */

const CHAIN_SEPARATOR = " -> ";

/** @type {Transformation} */
export async function resolveReferences(resource, context) {
  const referenceChain = [...context.referenceChain, resource.path];
  const resolveContext = { ...context, referenceChain };
  const resolvedData = { ...resource.data };

  for (const [key, value] of Object.entries(resource.data)) {
    if (value instanceof FileReference) {
      resolvedData[key] = resolveValue(value, resource, resolveContext);
    }
  }

  return new Resource({
    data: await Promise_allKeyed(resolvedData),
    content: resource.content,
    path: resource.path,
  });
}

/**
 * @param {FileReference} reference
 * @param {Resource} resource
 * @param {TransformerContext} context
 */
async function resolveValue(reference, resource, context) {
  const { transformers, dependencies, referenceChain } = context;

  const origin = reference.isAbsolute ? dependencies.root : resource.directory;
  const path = resolvePath(origin, reference.path);

  if (referenceChain.includes(path)) {
    throw new Error(`Circular file reference: ${[...referenceChain, path].join(CHAIN_SEPARATOR)}`);
  }

  const rawContent = await dependencies.loader.load(path);

  if (reference.type === "document") {
    const referencedResource = new Resource({ content: rawContent, path });

    return transformers.documentTransformer
      .setContext({ referenceChain })
      .transform(referencedResource);
  }

  const referencedResource = new Resource({ data: rawContent, path });
  const resolved = await transformers.dataTransformer
    .setContext({ referenceChain })
    .transform(referencedResource);

  return resolved.data;
}
