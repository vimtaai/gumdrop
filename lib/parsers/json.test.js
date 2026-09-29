import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { parseJson } from "./json.js";

describe("json", () => {
  it("parseJson() parses a JSON object", () => {
    const input = '{"title": "My Document", "draft": false}';
    const expectedOutput = { title: "My Document", draft: false };

    const result = parseJson(input);

    assert.deepEqual(result, expectedOutput);
  });

  it("parseJson() parses a top-level JSON array", () => {
    const input = '["alpha", "beta"]';
    const expectedOutput = ["alpha", "beta"];

    const result = parseJson(input);

    assert.deepEqual(result, expectedOutput);
  });

  it("parseJson() leaves a string that looks like a !file tag as a plain string", () => {
    const input = '{"author": "!file authors/jane.yaml"}';
    const expectedOutput = { author: "!file authors/jane.yaml" };

    const result = parseJson(input);

    assert.deepEqual(result, expectedOutput);
  });

  it("parseJson() throws on malformed JSON", () => {
    const input = '{"title": ';

    assert.throws(() => parseJson(input), SyntaxError);
  });
});
