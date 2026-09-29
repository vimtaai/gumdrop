import { getPathExtension, isPathAbsolute } from "../utils/path.js";

const DATA_EXTENSIONS = ["yaml", "yml"];
const DOCUMENT_EXTENSIONS = ["md", "html"];

export class FileReference {
  /** @type {string} */
  path;
  /** @type {"data" | "document"} */
  type;
  /** @type {string} */
  extension;

  /** @param {string} path */
  constructor(path) {
    const extension = getPathExtension(path);

    if (extension === "") {
      throw new Error(`File reference "${path}" has no extension`);
    }

    if (DATA_EXTENSIONS.includes(extension)) {
      this.type = "data";
    } else if (DOCUMENT_EXTENSIONS.includes(extension)) {
      this.type = "document";
    } else {
      throw new Error(`File reference "${path}" has an unrecognized extension: .${extension}`);
    }

    this.path = path;
    this.extension = extension;
  }

  /** @returns {boolean} */
  get isAbsolute() {
    return isPathAbsolute(this.path);
  }
}
