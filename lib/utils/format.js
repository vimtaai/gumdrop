import { getPathExtension } from "./path.js";

const EXTENSION_FORMATS = {
  md: "markdown",
  html: "html",
  yaml: "yaml",
  yml: "yaml",
  json: "json",
};
const NO_FORMAT = "";

/**
 * @param {string} path
 * @returns {string}
 */
export function getPathFormat(path) {
  const extension = getPathExtension(path);

  if (!Object.hasOwn(EXTENSION_FORMATS, extension)) {
    return NO_FORMAT;
  }

  return EXTENSION_FORMATS[extension];
}
