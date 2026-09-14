import { parse } from "yaml";

import { useTry } from "./use-try.js";

const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---\n?/;

const FILE_TAG = {
  tag: "!file",
  resolve(path) {
    return new FileReference(path);
  },
};

export class FileReference {
  /**
   * @param {string} path
   */
  constructor(path) {
    this.path = path;
  }
}

/**
 * @param {string} source
 * @returns {{ data: object, body: string }}
 */
export function parseFrontmatter(source) {
  const match = source.match(FRONTMATTER_PATTERN);

  if (!match) {
    return { data: {}, body: source };
  }

  const [frontmatter, frontmatterSource] = match;
  const data = parse(frontmatterSource, { customTags: [FILE_TAG] });
  const body = source.slice(frontmatter.length);

  return { data: data ?? {}, body };
}

useTry(parseFrontmatter);
