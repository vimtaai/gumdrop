import { ROOT_URL } from "../config.js";

export async function importModule(name) {
  const modulePath = `${ROOT_URL}/modules/${name}.js`;
  return import(modulePath);
}
