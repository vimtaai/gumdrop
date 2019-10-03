function getDocumentRoot() {
  const main = window.document.querySelector("main");

  if (main) {
    return main;
  }

  const script = window.document.querySelector("script");
  const root = window.document.createElement("main");
  script.parentNode.insertBefore(root, script);

  return root;
}

export const documentTitle = window.document.title;
export const documentRoot = getDocumentRoot();
export const loaderContent = documentRoot.innerHTML;
