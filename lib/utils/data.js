/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isDataMapping(value) {
  return value?.constructor === Object;
}
