import { Loader } from "../lib/loaders/loader.js";

/**
 * @param {(path: string) => Promise<string>} loadFile
 * @returns {Loader}
 */
export function createTestLoader(loadFile) {
  const loader = new Loader();
  loader.loadFile = loadFile;

  return loader;
}
