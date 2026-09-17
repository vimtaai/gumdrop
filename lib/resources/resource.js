export class Resource {
  /** @type {string | object} */
  data;
  /** @type {string} */
  content;

  /** @param {{ data?: string | object, content?: string }} [options] */
  constructor({ data = "", content = "" } = {}) {
    this.data = data;
    this.content = content;
  }
}
