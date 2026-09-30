import { Liquid, Tag } from "liquidjs";

/** Tags that read templates through LiquidJS's own filesystem access, bypassing the Loader. */
const FILESYSTEM_TAGS = ["include", "render", "layout"];

/**
 * @param {string} input
 * @param {object} data
 * @returns {Promise<string>}
 */
export async function renderLiquid(input, data) {
  const engine = new Liquid();

  for (const name of FILESYSTEM_TAGS) {
    engine.registerTag(name, createUnsupportedTag(name));
  }

  return engine.parseAndRender(input, data);
}

/** @param {string} name */
function createUnsupportedTag(name) {
  return class extends Tag {
    constructor(...args) {
      super(...args);
      throw new Error(`The "${name}" tag is not supported`);
    }
  };
}
