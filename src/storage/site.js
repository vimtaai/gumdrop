function getDocumentRoot() {
  const mainElement = window.document.querySelector("main");

  if (mainElement) {
    return mainElement;
  }

  const firstScript = window.document.querySelector("script");
  const documentRoot = window.document.createElement("main");

  firstScript.parentNode.insertBefore(documentRoot, firstScript);

  return documentRoot;
}

function getDocumentTitle() {
  return window.document.title;
}

function getDocumentLoader() {
  return getDocumentRoot().innerHTML;
}

export const Site = {
  root: getDocumentRoot(),
  title: getDocumentTitle(),
  loader: getDocumentLoader(),
};
