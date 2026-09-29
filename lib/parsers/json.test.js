import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { parseJson } from "./json.js";

describe("json", () => {
  describe("parseJson()", () => {
    it("parses a JSON object", () => {
      const input = '{"title": "My Document", "draft": false}';
      const expectedOutput = { title: "My Document", draft: false };

      const result = parseJson(input);

      assert.deepEqual(result, expectedOutput);
    });

    it("parses a top-level JSON array", () => {
      const input = '["alpha", "beta"]';
      const expectedOutput = ["alpha", "beta"];

      const result = parseJson(input);

      assert.deepEqual(result, expectedOutput);
    });

    it("leaves a string that looks like a !file tag as a plain string", () => {
      const input = '{"author": "!file authors/jane.yaml"}';
      const expectedOutput = { author: "!file authors/jane.yaml" };

      const result = parseJson(input);

      assert.deepEqual(result, expectedOutput);
    });

    it("throws on malformed JSON", () => {
      const input = '{"title": ';

      assert.throws(() => parseJson(input), SyntaxError);
    });
  });
});
