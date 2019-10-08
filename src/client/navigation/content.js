import { imports } from "network/remote/imports";

import { fetchResource } from "network/server/fetch";
import { documentRoot, loaderContent } from "client/document";

export async function updateContent(currentPage) {
  const timeoutUntilLoader = 500;

  const loaderTimer = window.setTimeout(function() {
    documentRoot.innerHTML = loaderContent;
  }, timeoutUntilLoader);

  const path = `pages/${currentPage}.md`;
  const content = await fetchResource(path);

  documentRoot.innerHTML = content;

  if (document.querySelector("pre > code")) {
    const Prism = await imports.prismjs;
    Prism.highlightAll();
  }

  window.clearTimeout(loaderTimer);
}
