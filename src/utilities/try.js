export function useTry(callback) {
  callback.try = async function (...args) {
    try {
      const result = await callback(...args);
      return [null, result];
    } catch (error) {
      return [error, null];
    }
  };

  return callback;
}
