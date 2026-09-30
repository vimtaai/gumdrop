import createDOMPurify from "dompurify";

import { parseData, parseFrontmatter } from "../transformations/parse.js";
import { renderContent } from "../transformations/render.js";
import { resolveReferences } from "../transformations/resolve.js";
import { sanitizeContent } from "../transformations/sanitize.js";
import { splitFrontmatter } from "../transformations/split.js";
import { renderTemplate } from "../transformations/template.js";
import { Transformer } from "../utils/transformer.js";

/** @import { Loader } from "../loaders/loader.js" */

/**
 * @param {{ loader: Loader, window?: Window, root?: string }} environment
 * @returns {Transformer}
 */
export function createDocumentTransformer({ loader, window, root = "" }) {
  const sanitize = createDOMPurify(window).sanitize;
  const dependencies = { loader, sanitize, root };
  const transformers = {};
  const referenceChain = [];
  const transformerContext = { dependencies, transformers, referenceChain };

  const dataTransformer = new Transformer()
    .use(parseData)
    .use(resolveReferences)
    .setContext(transformerContext);

  const documentTransformer = new Transformer()
    .use(splitFrontmatter)
    .use(parseFrontmatter)
    .use(resolveReferences)
    .use(renderTemplate)
    .setContext(transformerContext);

  const mainDocumentTransformer = documentTransformer.use(renderContent).use(sanitizeContent);

  transformers.dataTransformer = dataTransformer;
  transformers.documentTransformer = documentTransformer;

  return mainDocumentTransformer;
}
