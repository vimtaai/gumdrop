import { documentRoot, documentTitle } from "./document";

export function updateTitle() {
  const firstHeading = documentRoot.querySelector("h1");

  document.title = firstHeading ? `${firstHeading.textContent} | ${documentTitle}` : documentTitle;
}
