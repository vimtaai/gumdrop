import { importModule } from "./utilities/module.js";
import { fetchResource } from "./resource.js";
import { parseLocation } from "./location.js";

export async function navigate() {
  const { origin } = window.location;
  const { page, extension } = parseLocation(window.location);

  const [_, content] = await fetchResource.try(origin, `${page}.${extension}`);

  if (content) {
    const mainElement = document.querySelector("main");
    mainElement.innerHTML = await parseContent(content);
  }
}

async function parseContent(content) {
  const { parseMarkdown } = await importModule("markdown");
  return parseMarkdown(content);
}
