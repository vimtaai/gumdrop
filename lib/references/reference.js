import { getPathFormat, isFormatKnown } from "../utils/format.js";
import { getPathExtension, isPathAbsolute } from "../utils/path.js";

export class FileReference {
  /** @type {string} */
  path;
  /** @type {string} */
  format;

  /** @param {string} path */
  constructor(path) {
    const extension = getPathExtension(path);
    const format = getPathFormat(path);

    if (extension === "") {
      throw new Error(`File reference "${path}" has no extension`);
    }

    if (!isFormatKnown(format)) {
      throw new Error(`File reference "${path}" has an unrecognized extension: .${extension}`);
    }

    this.path = path;
    this.format = format;
  }

  /** @returns {boolean} */
  get isAbsolute() {
    return isPathAbsolute(this.path);
  }
}
