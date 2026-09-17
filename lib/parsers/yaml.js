import { parse } from "yaml";

import { FileReference } from "../references/reference.js";
import { useTry } from "../utils/use-try.js";

const FILE_TAG = {
  tag: "!file",
  resolve: (path) => new FileReference(path),
};

/**
 * @param {string} input
 * @returns {object}
 */
export function parseYaml(input) {
  const data = parse(input, { customTags: [FILE_TAG] });
  return data ?? {};
}

useTry(parseYaml);
