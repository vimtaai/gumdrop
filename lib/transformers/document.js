import createDOMPurify from "dompurify";

import { parseData } from "../transformations/parse.js";
import { renderContent } from "../transformations/render.js";
import { resolveReferences } from "../transformations/resolve.js";
import { sanitizeContent } from "../transformations/sanitize.js";
import { splitFrontmatter } from "../transformations/split.js";
import { Transformer } from "../utils/transformer.js";

/**
 * @param {{ loader: import("../utils/transformer.js").Loader, window?: Window }} dependencies
 * @returns {Transformer}
 */
export function createDocumentTransformer({ loader, window }) {
  const sanitizer = createDOMPurify(window).sanitize;
  const transformerContext = { loader, sanitizer, transformers: {} };

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

  transformerContext.transformers.dataTransformer = dataTransformer;
  transformerContext.transformers.documentTransformer = documentTransformer;

  return documentTransformer;
}
