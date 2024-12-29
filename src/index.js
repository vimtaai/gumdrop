import { NotFoundError, ServerError } from "./errors.js";

export async function loadPage(location) {
  const { origin } = window.location;

  const page = location || "index";
  const url = `${origin}/${page}.md`;

  const response = await window.fetch(url);

  if (response.status === 404) {
    throw new NotFoundError();
  }

  if (response.status === 500) {
    throw new ServerError();
  }

  return response.text();
}

export async function navigate() {
  const { hash } = window.location;
  const { page } = parseHash(hash);

  const content = await loadPage(page);

  const mainElement = document.querySelector("main");
  mainElement.innerHTML = content;
}

function parseHash(hash) {
  const HASH_BANG_REGEX = /^#!\//;
  const [page, fragment] = hash.replace(HASH_BANG_REGEX, "").split("#", 1);

  return { page, fragment };
}
