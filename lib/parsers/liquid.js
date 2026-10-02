import { Liquid, Tag } from "liquidjs";

const DISALLOWED_TAGS = ["include", "render", "layout"];

/**
 * @param {string} input
 * @param {object} data
 * @returns {Promise<string>}
 */
export async function renderLiquid(input, data) {
  const engine = new Liquid();

  for (const name of DISALLOWED_TAGS) {
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
