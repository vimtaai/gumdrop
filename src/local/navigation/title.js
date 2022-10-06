import { Site } from "../../storage/site.js";

export function updateTitle() {
  const firstHeading = document.querySelector("h1");

  document.title = firstHeading ? `${firstHeading.textContent} | ${Site.title}` : `${Site.title}`;
}
