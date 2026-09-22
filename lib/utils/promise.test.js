import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Promise_allKeyed } from "./promise.js";

describe("promise", () => {
  describe("Promise_allKeyed()", () => {
    it("resolves each value and keeps its key", async () => {
      const input = { author: Promise.resolve("Jane"), editor: Promise.resolve("John") };
      const expectedOutput = { author: "Jane", editor: "John" };

      const result = await Promise_allKeyed(input);

      assert.deepEqual(result, expectedOutput);
    });

    it("passes a non-promise value through unchanged", async () => {
      const input = { title: "My Document", author: Promise.resolve("Jane") };
      const expectedOutput = { title: "My Document", author: "Jane" };

      const result = await Promise_allKeyed(input);

      assert.deepEqual(result, expectedOutput);
    });

    it("returns an empty object for an empty object", async () => {
      const expectedOutput = {};

      const result = await Promise_allKeyed({});

      assert.deepEqual(result, expectedOutput);
    });

    it("awaits values concurrently rather than one after another", async () => {
      const order = [];
      const track = async (name) => {
        order.push(name);
        return name;
      };
      const input = { first: track("first"), second: track("second") };

      await Promise_allKeyed(input);

      assert.deepEqual(order, ["first", "second"]);
    });

    it("rejects with the first rejection reason", async () => {
      const input = {
        author: Promise.reject(new Error("not found")),
        editor: Promise.resolve("John"),
      };

      await assert.rejects(() => Promise_allKeyed(input), /not found/);
    });

    it("resolves a value stored under a symbol key", async () => {
      const key = Symbol("author");
      const input = { [key]: Promise.resolve("Jane") };
      const expectedOutput = "Jane";

      const result = await Promise_allKeyed(input);

      assert.equal(result[key], expectedOutput);
    });

    it("ignores a non-enumerable property", async () => {
      const input = {};
      Object.defineProperty(input, "hidden", { value: Promise.resolve("no"), enumerable: false });
      const expectedOutput = {};

      const result = await Promise_allKeyed(input);

      assert.deepEqual(result, expectedOutput);
    });
  });
});
