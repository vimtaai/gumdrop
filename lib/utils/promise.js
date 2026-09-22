/**
 * Stands in for the TC39 `Promise.allKeyed` proposal (stage 3), which Node does not ship yet.
 * The name mirrors the eventual call, so migrating is `Promise_allKeyed` -> `Promise.allKeyed`.
 *
 * @param {Record<string | symbol, unknown>} object
 * @returns {Promise<Record<string | symbol, unknown>>}
 */
export async function Promise_allKeyed(object) {
  const keys = Reflect.ownKeys(object).filter(
    (key) => Object.getOwnPropertyDescriptor(object, key)?.enumerable,
  );
  const values = await Promise.all(keys.map((key) => object[key]));

  return Object.fromEntries(keys.map((key, index) => [key, values[index]]));
}
