/**
 * @template {Function} T
 * @param {T} fn
 * @returns {T}
 */
export function useTry(fn) {
  fn.try = async (...args) => {
    try {
      return [null, await fn(...args)];
    } catch (error) {
      return [error, null];
    }
  };

  return fn;
}
