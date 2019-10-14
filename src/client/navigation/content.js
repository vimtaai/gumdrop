import { imports } from "storage/imports";

import { Document } from "utils/resource/document";
import { ResourcePath } from "utils/resource-path";
import { documentRoot, loaderContent } from "client/document";
import { fetchResource } from "network/server/fetch";

const timeoutUntilLoader = 500;

export async function updateContent(location) {
  const loaderTimer = window.setTimeout(function() {
    documentRoot.innerHTML = loaderContent;
  }, timeoutUntilLoader);

  let page;

  try {
    const pagePath = new ResourcePath(location.page, "pages", "md");
    page = await fetchResource(pagePath);
  } catch (error) {
    try {
      const errorPath = new ResourcePath(error.httpErrorCode, "errors", "md");
      page = await fetchResource(errorPath);
    } catch (_) {
      page = error.message;
    }
  }

  if (page instanceof Document) {
    documentRoot.innerHTML = page;
  } else if (typeof page === "string") {
    documentRoot.innerHTML = page;
  }

  if (document.querySelector("pre > code")) {
    const Prism = await imports.prismjs;
    Prism.highlightAll();
  }

  window.clearTimeout(loaderTimer);
}
