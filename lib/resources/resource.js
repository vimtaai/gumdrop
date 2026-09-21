export class Resource {
  /** @type {string | object} */
  data;
  /** @type {string} */
  content;
  /** @type {string} */
  path;

  /** @param {{ data?: string | object, content?: string, path?: string }} [options] */
  constructor({ data = "", content = "", path = "" } = {}) {
    this.data = data;
    this.content = content;
    this.path = path;
  }
}
