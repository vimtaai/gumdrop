const PATH_SEPARATOR = "/";
const ROOT_DIRECTORY = PATH_SEPARATOR;
const CURRENT_DIRECTORY = ".";
const PARENT_DIRECTORY = "..";
const NO_DIRECTORY = "";

/**
 * @param {string} path
 * @returns {boolean}
 */
export function isPathAbsolute(path) {
  return path.startsWith(PATH_SEPARATOR);
}

/**
 * @param {string} path
 * @returns {string}
 */
export function getDirectory(path) {
  const lastSeparatorIndex = path.lastIndexOf(PATH_SEPARATOR);

  if (lastSeparatorIndex === -1) {
    return NO_DIRECTORY;
  }

  if (lastSeparatorIndex === 0) {
    return ROOT_DIRECTORY;
  }

  return path.slice(0, lastSeparatorIndex);
}

/**
 * @param {string} base
 * @param {string} path
 * @returns {string}
 */
export function resolvePath(base, path) {
  const isAbsolute = isPathAbsolute(base);
  const fullPath = `${base}${PATH_SEPARATOR}${path}`;
  const segments = [];

  for (const segment of fullPath.split(PATH_SEPARATOR)) {
    if (segment === CURRENT_DIRECTORY || segment === "") {
      continue;
    }

    if (segment === PARENT_DIRECTORY && canWalkUp(segments)) {
      segments.pop();
      continue;
    }

    if (segment === PARENT_DIRECTORY && isAbsolute) {
      continue;
    }

    segments.push(segment);
  }

  const prefix = isAbsolute ? ROOT_DIRECTORY : NO_DIRECTORY;
  const resolvedPath = segments.join(PATH_SEPARATOR);

  return `${prefix}${resolvedPath}`;
}

/**
 * @param {string[]} segments
 * @returns {boolean}
 */
function canWalkUp(segments) {
  return segments.length > 0 && segments.at(-1) !== PARENT_DIRECTORY;
}
