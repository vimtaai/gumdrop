/**
 * Attaches a `.try()` variant to `fn` that resolves to an `[error, result]` tuple instead of
 * throwing. `fn` itself keeps throwing, so internal callers compose it directly and only
 * I/O boundaries reach for `.try()`.
 *
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
