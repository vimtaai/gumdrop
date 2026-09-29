import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { useTry } from "./use-try.js";

describe("use-try", () => {
  describe("useTry()", () => {
    it("resolves a successful call to a [null, result] tuple", async () => {
      const input = "value";
      const expectedOutput = [null, "value"];

      const succeed = useTry(async (value) => value);
      const result = await succeed.try(input);

      assert.deepEqual(result, expectedOutput);
    });

    it("resolves a thrown error to an [error, null] tuple", async () => {
      const input = new Error("failure");
      const expectedOutput = [input, null];

      const fail = useTry(async () => {
        throw input;
      });
      const result = await fail.try();

      assert.deepEqual(result, expectedOutput);
    });

    it("leaves the wrapped function throwing when called directly", async () => {
      const input = new Error("failure");

      const fail = useTry(async () => {
        throw input;
      });

      await assert.rejects(() => fail(), input);
    });
  });
});
