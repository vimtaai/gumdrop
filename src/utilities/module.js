import { BASE_URL } from "../config.js";
import { parseLocation } from "../location.js";

export async function importModule(name) {
  const { baseUrl } = parseLocation(BASE_URL);
  const modulePath = `${baseUrl}/modules/${name}.js`;
  return import(modulePath);
}
