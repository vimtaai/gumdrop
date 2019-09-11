import { documentTitle, documentRoot } from "client/document";

export function updateTitle() {
  const firstHeading = documentRoot.querySelector("h1");

  window.document.title = firstHeading
    ? `${firstHeading.textContent} | ${documentTitle}`
    : `${documentTitle}`;
}
