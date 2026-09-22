export class Loader {
  /** @type {Map<string, Promise<string>>} */
  #promiseCache = new Map();

  /**
   * @param {string} path
   * @returns {Promise<string>}
   */
  load(path) {
    const loadPromise = this.#promiseCache.get(path) ?? this.loadFile(path);
    this.#promiseCache.set(path, loadPromise);

    return loadPromise;
  }

  /**
   * @param {string} _path
   * @returns {Promise<string>}
   */
  async loadFile(_path) {
    throw new Error(`${this.constructor.name} must implement loadFile()`);
  }
}
