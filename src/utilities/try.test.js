import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { useTry } from "./try.js";

describe("useTry()", () => {
  it("returns the original callback", () => {
    const callback = () => {};

    const callbackWithTry = useTry(callback);

    assert.strictEqual(callbackWithTry, callback);
  });

  describe(".try()", () => {
    it("calls the original callback", async () => {
      const callback = mock.fn(() => {});

      useTry(callback);
      await callback.try();

      const callbackCallCount = callback.mock.callCount();
      assert.strictEqual(callbackCallCount, 1);
    });

    it("passes all arguments to the original callback", async () => {
      const callback = mock.fn(() => {});
      const callbackArgs = ["test-argument-1", "test-argument-2"];

      useTry(callback);
      await callback.try(...callbackArgs);

      const callbackCall = callback.mock.calls[0];
      assert.deepStrictEqual(callbackCall.arguments, callbackArgs);
    });

    it("returns a [null, result] tuple on callback resolve", async () => {
      const callback = () => Promise.resolve("test-value");

      useTry(callback);
      const [error, result] = await callback.try();

      assert.strictEqual(error, null);
      assert.strictEqual(result, "test-value");
    });

    it("returns a [error, null] tuple on callback resolve", async () => {
      const callback = () => Promise.reject("test-error");

      useTry(callback);
      const [error, result] = await callback.try();

      assert.strictEqual(error, "test-error");
      assert.strictEqual(result, null);
    });
  });
});
