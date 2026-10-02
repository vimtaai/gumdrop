import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { getPathFormat } from "./format.js";

describe("format", () => {
  describe("getPathFormat()", () => {
    it("returns the format of a document path", () => {
      const input = "partials/intro.md";
      const expectedOutput = "markdown";

      const result = getPathFormat(input);

      assert.equal(result, expectedOutput);
    });

    it("returns the same format for every extension of that format", () => {
      const input = ["authors/jane.yaml", "authors/jane.yml"];
      const expectedOutput = ["yaml", "yaml"];

      const result = input.map(getPathFormat);

      assert.deepEqual(result, expectedOutput);
    });

    it("returns an empty string for an unrecognized extension", () => {
      const input = "data/prices.csv";
      const expectedOutput = "";

      const result = getPathFormat(input);

      assert.equal(result, expectedOutput);
    });

    it("returns an empty string for a path with no extension", () => {
      const input = "data/prices";
      const expectedOutput = "";

      const result = getPathFormat(input);

      assert.equal(result, expectedOutput);
    });

    it("returns an empty string for an extension naming an inherited object property", () => {
      const input = "x.constructor";
      const expectedOutput = "";

      const result = getPathFormat(input);

      assert.equal(result, expectedOutput);
    });
  });
});
