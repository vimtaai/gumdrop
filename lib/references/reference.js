import { isPathAbsolute } from "../utils/path.js";

const EXTENSION_PATTERN = /\.([^/.]+)$/;
const DATA_EXTENSIONS = new Set(["yaml", "yml"]);
const DOCUMENT_EXTENSIONS = new Set(["md", "html"]);

export class FileReference {
  /** @type {string} */
  path;
  /** @type {"data" | "document"} */
  type;
  /** @type {string} */
  extension;

  /** @param {string} path */
  constructor(path) {
    const [, extension] = path.match(EXTENSION_PATTERN) ?? [];

    if (extension === undefined) {
      throw new Error(`File reference "${path}" has no extension`);
    }

    if (DATA_EXTENSIONS.has(extension)) {
      this.type = "data";
    } else if (DOCUMENT_EXTENSIONS.has(extension)) {
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
