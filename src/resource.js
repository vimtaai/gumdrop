import { useTry } from "./utilities/try.js";

useTry(fetchResource);
export async function fetchResource(baseUrl, path = "") {
  const url = `${baseUrl}/${path}`;
  const response = await window.fetch(url);

  if (!response.ok) {
    throw new Error(response.message, {
      cause: response.status,
    });
  }

  return response.text();
}
