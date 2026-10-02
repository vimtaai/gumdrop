import { FileReference } from "../references/reference.js";
import { Resource } from "../resources/resource.js";
import { isDataMapping } from "../utils/data.js";
import { resolvePath } from "../utils/path.js";
import { Promise_allKeyed } from "../utils/promise.js";

/** @import { Transformation, TransformerContext } from "../utils/transformer.js" */

const CHAIN_SEPARATOR = " -> ";
const HTML_EXTENSION = "html";

/** @type {Transformation} */
export async function resolveReferences(resource, context) {
  if (!containsReference(resource.data)) {
    return resource;
  }

  const referenceChain = [...context.referenceChain, resource.path];
  const resolveContext = { ...context, referenceChain };

  return new Resource({
    data: await resolveData(resource.data, resource, resolveContext),
    content: resource.content,
    path: resource.path,
  });
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function containsReference(value) {
  if (value instanceof FileReference) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.some(containsReference);
  }

  if (isDataMapping(value)) {
    return Object.values(value).some(containsReference);
  }

  return false;
}

/**
 * @param {unknown} value
 * @param {Resource} resource
 * @param {TransformerContext} context
 */
async function resolveData(value, resource, context) {
  if (value instanceof FileReference) {
    return resolveReference(value, resource, context);
  }

  const resolveItem = (item) => resolveData(item, resource, context);

  if (Array.isArray(value)) {
    return Promise.all(value.map(resolveItem));
  }

  if (isDataMapping(value)) {
    const entries = Object.entries(value);
    const resolvedEntries = entries.map(([key, item]) => [key, resolveItem(item)]);

    return Promise_allKeyed(Object.fromEntries(resolvedEntries));
  }

  return value;
}

/**
 * @param {FileReference} reference
 * @param {Resource} resource
 * @param {TransformerContext} context
 */
async function resolveReference(reference, resource, context) {
  const { transformers, dependencies, referenceChain } = context;

  const origin = reference.isAbsolute ? dependencies.root : resource.directory;
  const path = resolvePath(origin, reference.path);

  if (referenceChain.includes(path)) {
    throw new Error(`Circular file reference: ${[...referenceChain, path].join(CHAIN_SEPARATOR)}`);
  }

  const rawContent = await dependencies.loader.load(path);
  const isDocument = reference.type === "document";

  const documentTransformer =
    reference.extension === HTML_EXTENSION ? transformers.html : transformers.markdown;
  const resourceTransformer = isDocument ? documentTransformer : transformers.data;

  const referencedResource = isDocument
    ? new Resource({ content: rawContent, path })
    : new Resource({ data: rawContent, path });

  const resolvedResource = await resourceTransformer
    .setContext({ referenceChain })
    .transform(referencedResource);

  return isDocument ? resolvedResource.content : resolvedResource.data;
}
