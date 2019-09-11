import { fetchContent } from "network/server/fetch";

import { documentRoot, loaderContent } from "client/document";

export async function updateContent(currentPage) {
  const timeoutUntilLoader = 500;

  const loaderTimer = window.setTimeout(function() {
    documentRoot.innerHTML = loaderContent;
  }, timeoutUntilLoader);

  const file = currentPage || "index";
  const content = await fetchContent("pages", file, "md");

  documentRoot.innerHTML = content;
  window.clearTimeout(loaderTimer);
}
