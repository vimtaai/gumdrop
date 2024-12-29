import { NotFoundError, ServerError } from "./errors.js";

export async function loadPage(location) {
  const origin = window.location.origin;
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
