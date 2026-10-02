import { getPathFormat } from "../utils/format.js";
import { getPathExtension, isPathAbsolute } from "../utils/path.js";

const DATA_FORMATS = ["yaml", "json"];
const DOCUMENT_FORMATS = ["markdown", "html"];

export class FileReference {
  /** @type {string} */
  path;
  /** @type {"data" | "document"} */
  type;
  /** @type {string} */
  format;

  /** @param {string} path */
  constructor(path) {
    const extension = getPathExtension(path);
    const format = getPathFormat(path);

    if (extension === "") {
      throw new Error(`File reference "${path}" has no extension`);
    }

    if (DATA_FORMATS.includes(format)) {
      this.type = "data";
    } else if (DOCUMENT_FORMATS.includes(format)) {
      this.type = "document";
    } else {
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
