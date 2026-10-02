import { getPathExtension } from "./path.js";

const FORMAT_EXTENSIONS = {
  markdown: ["md"],
  html: ["html"],
  yaml: ["yaml", "yml"],
  json: ["json"],
};
const NO_FORMAT = "";

/**
 * @param {string} path
 * @returns {string}
 */
export function getPathFormat(path) {
  const extension = getPathExtension(path);
  const formats = Object.keys(FORMAT_EXTENSIONS);

  return formats.find((format) => FORMAT_EXTENSIONS[format].includes(extension)) ?? NO_FORMAT;
}
