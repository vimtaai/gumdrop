import { imports } from "network/remote/imports";

import { fetchResource } from "network/server/fetch";
import { documentRoot, loaderContent } from "client/document";
import { parseMarkdown } from "../../network/server/parsers/markdown";

export async function updateContent(currentPage) {
  const timeoutUntilLoader = 500;

  const loaderTimer = window.setTimeout(function() {
    documentRoot.innerHTML = loaderContent;
  }, timeoutUntilLoader);

  const path = `pages/${currentPage}.md`;
  const content = await fetchResource(path);
  const html = await parseMarkdown(content);

  documentRoot.innerHTML = html;

  const Prism = await imports.prismjs;
  Prism.highlightAll();

  window.clearTimeout(loaderTimer);
}
