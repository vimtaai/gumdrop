import { importModule } from "./utilities/module.js";
import { fetchResource } from "./resource.js";
import { parseHashBang, parseLocation } from "./location.js";

export async function navigate() {
  const { baseUrl, hashBang } = parseLocation(window.location);
  const { page, extension } = parseHashBang(hashBang);

  const [_, content] = await fetchResource.try(baseUrl, `${page}.${extension}`);

  if (content) {
    const mainElement = document.querySelector("main");
    mainElement.innerHTML = await parseContent(content);
  }
}

async function parseContent(content) {
  const { parseMarkdown } = await importModule("markdown");
  return parseMarkdown(content);
}
