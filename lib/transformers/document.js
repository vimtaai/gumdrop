import createDOMPurify from "dompurify";

import { parseData, parseFrontmatter } from "../transformations/parse.js";
import { renderContent } from "../transformations/render.js";
import { resolveReferences } from "../transformations/resolve.js";
import { sanitizeContent } from "../transformations/sanitize.js";
import { splitFrontmatter } from "../transformations/split.js";
import { renderTemplate } from "../transformations/template.js";
import { Transformer } from "../utils/transformer.js";

/** @import { Loader } from "../loaders/loader.js" */

const BASE_DATA_TRANSFORMER = new Transformer().use(parseData).use(resolveReferences);
const BASE_DOCUMENT_TRANSFORMER = new Transformer()
  .use(splitFrontmatter)
  .use(parseFrontmatter)
  .use(resolveReferences)
  .use(renderTemplate);

/**
 * @param {{ loader: Loader, window?: Window, root?: string }} environment
 * @returns {{ html: Transformer, markdown: Transformer }}
 */
export function createDocumentTransformers({ loader, window, root = "" }) {
  const sanitize = createDOMPurify(window).sanitize;
  const dependencies = { loader, sanitize, root };

  const htmlTransformers = {
    data: BASE_DATA_TRANSFORMER,
    html: BASE_DOCUMENT_TRANSFORMER,
    markdown: BASE_DOCUMENT_TRANSFORMER.use(renderContent),
  };

  const markdownTransformers = {
    data: BASE_DATA_TRANSFORMER,
    html: BASE_DOCUMENT_TRANSFORMER,
    markdown: BASE_DOCUMENT_TRANSFORMER,
  };

  const htmlContext = {
    dependencies,
    transformers: htmlTransformers,
    referenceChain: [],
  };

  const markdownContext = {
    dependencies,
    transformers: markdownTransformers,
    referenceChain: [],
  };

  htmlTransformers.data = htmlTransformers.data.setContext(htmlContext);
  htmlTransformers.markdown = htmlTransformers.markdown.setContext(markdownContext);
  htmlTransformers.html = htmlTransformers.html.setContext(htmlContext);

  markdownTransformers.data = markdownTransformers.data.setContext(markdownContext);
  markdownTransformers.markdown = markdownTransformers.markdown.setContext(markdownContext);
  markdownTransformers.html = markdownTransformers.html.setContext(htmlContext);

  const htmlDocumentTransformer = htmlTransformers.html.use(sanitizeContent);
  const markdownDocumentTransformer = htmlTransformers.markdown.use(sanitizeContent);

  return { html: htmlDocumentTransformer, markdown: markdownDocumentTransformer };
}
