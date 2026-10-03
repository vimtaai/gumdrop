import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { getPathFormat, isFormatDocument, isFormatKnown } from "./format.js";

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

  describe("isFormatDocument()", () => {
    it("returns true for a document format", () => {
      const input = ["markdown", "html"];
      const expectedOutput = [true, true];

      const result = input.map(isFormatDocument);

      assert.deepEqual(result, expectedOutput);
    });

    it("returns false for a data format", () => {
      const input = ["yaml", "json"];
      const expectedOutput = [false, false];

      const result = input.map(isFormatDocument);

      assert.deepEqual(result, expectedOutput);
    });
  });

  describe("isFormatKnown()", () => {
    it("returns true for a format in the format table", () => {
      const input = ["markdown", "html", "yaml", "json"];
      const expectedOutput = [true, true, true, true];

      const result = input.map(isFormatKnown);

      assert.deepEqual(result, expectedOutput);
    });

    it("returns false for the format of an unrecognized extension", () => {
      const input = getPathFormat("data/prices.csv");
      const expectedOutput = false;

      const result = isFormatKnown(input);

      assert.equal(result, expectedOutput);
    });

    it("returns false for a name inherited from Object", () => {
      const input = "constructor";
      const expectedOutput = false;

      const result = isFormatKnown(input);

      assert.equal(result, expectedOutput);
    });
  });
});
