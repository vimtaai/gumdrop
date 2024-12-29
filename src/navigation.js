import { NetworkError, NotFoundError, ServerError } from "./errors.js";

export async function loadPage(location) {
  const { origin } = window.location;

  const page = location || "index";
  const url = `${origin}/${page}.md`;
  const result = { error: null, content: null };

  try {
    const response = await window.fetch(url);

    if (response.status === 404) {
      result.error = new NotFoundError();
    }

    if (response.status === 500) {
      result.error = new ServerError();
    }

    if (response.ok) {
      result.content = await response.text();
    }
  } catch {
    result.error = new NetworkError();
  }

  return [result.error, result.content];
}

export async function navigate() {
  const { hash } = window.location;
  const { page } = parseHash(hash);

  const [_, content] = await loadPage(page);

  const mainElement = document.querySelector("main");
  mainElement.innerHTML = content;
}

function parseHash(hash) {
  const HASH_BANG_REGEX = /^#!\//;
  const [page, fragment] = hash.replace(HASH_BANG_REGEX, "").split("#", 1);

  return { page, fragment };
}
