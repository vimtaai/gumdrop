import { Liquid } from "liquidjs";

/**
 * @param {string} input
 * @param {object} data
 * @returns {Promise<string>}
 */
export async function renderLiquid(input, data) {
  const engine = new Liquid();

  return engine.parseAndRender(input, data);
}
