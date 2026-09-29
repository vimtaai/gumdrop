import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { FileReference } from "../references/reference.js";
import { parseYaml } from "./yaml.js";

describe("yaml", () => {
  describe("parseYaml()", () => {
    it("parses YAML text into an object", () => {
      const input = "title: My Document";
      const expectedOutput = { title: "My Document" };

      const result = parseYaml(input);

      assert.deepEqual(result, expectedOutput);
    });

    it("parses a !file-tagged value into a FileReference", () => {
      const input = "author: !file authors/jane.yaml\nplain: not-a-file";
      const expectedOutput = {
        author: new FileReference("authors/jane.yaml"),
        plain: "not-a-file",
      };

      const result = parseYaml(input);

      assert.deepEqual(result, expectedOutput);
    });

    it("returns an empty object when given an empty string", () => {
      const input = "";
      const expectedOutput = {};

      const result = parseYaml(input);

      assert.deepEqual(result, expectedOutput);
    });

    it("throws on malformed YAML", () => {
      const input = "title: [unterminated";

      assert.throws(() => parseYaml(input));
    });

    it("resolves a failure to an [error, null] tuple via .try()", async () => {
      const input = "title: [unterminated";

      const [error, result] = await parseYaml.try(input);

      assert.ok(error);
      assert.equal(result, null);
    });
  });
});
