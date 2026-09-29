import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { FileReference } from "../references/reference.js";
import { isDataMapping } from "./data.js";

describe("data", () => {
  describe("isDataMapping()", () => {
    it("returns true for a mapping of fields", () => {
      const input = { title: "My Document" };

      const result = isDataMapping(input);

      assert.equal(result, true);
    });

    it("returns true for an empty mapping", () => {
      const input = {};

      const result = isDataMapping(input);

      assert.equal(result, true);
    });

    it("returns false for a sequence", () => {
      const input = ["alpha", "beta"];

      const result = isDataMapping(input);

      assert.equal(result, false);
    });

    it("returns false for a string", () => {
      const input = "My Document";

      const result = isDataMapping(input);

      assert.equal(result, false);
    });

    it("returns false for a number", () => {
      const input = 42;

      const result = isDataMapping(input);

      assert.equal(result, false);
    });

    it("returns false for a boolean", () => {
      const input = true;

      const result = isDataMapping(input);

      assert.equal(result, false);
    });

    it("returns false for null", () => {
      const input = null;

      const result = isDataMapping(input);

      assert.equal(result, false);
    });

    it("returns false for undefined", () => {
      const input = undefined;

      const result = isDataMapping(input);

      assert.equal(result, false);
    });

    it("returns false for a class instance", () => {
      const input = new FileReference("authors/jane.yaml");

      const result = isDataMapping(input);

      assert.equal(result, false);
    });

    it("returns false for a built-in collection", () => {
      const input = new Set(["alpha"]);

      const result = isDataMapping(input);

      assert.equal(result, false);
    });
  });
});
