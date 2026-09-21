import createDOMPurify from "dompurify";

import { parseData } from "../transformations/parse.js";
import { renderContent } from "../transformations/render.js";
import { resolveReferences } from "../transformations/resolve.js";
import { sanitizeContent } from "../transformations/sanitize.js";
import { splitFrontmatter } from "../transformations/split.js";
import { Transformer } from "../utils/transformer.js";

/** @import { Loader } from "../utils/transformer.js" */

/**
 * @param {{ loadFile: Loader, window?: Window, root?: string }} environment
 * @returns {Transformer}
 */
export function createDocumentTransformer({ loadFile, window, root = "" }) {
  const sanitize = createDOMPurify(window).sanitize;
  const dependencies = { loadFile, sanitize, root };
  const transformers = {};
  const transformerContext = { dependencies, transformers };

  const dataTransformer = new Transformer()
    .use(parseData)
    .use(resolveReferences)
    .setContext(transformerContext);

  const documentTransformer = new Transformer()
    .use(splitFrontmatter)
    .use(parseData)
    .use(resolveReferences)
    .use(renderContent)
    .use(sanitizeContent)
    .setContext(transformerContext);

  transformers.dataTransformer = dataTransformer;
  transformers.documentTransformer = documentTransformer;

  return documentTransformer;
}
