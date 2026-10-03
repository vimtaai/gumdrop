import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { FileReference } from "./reference.js";

describe("reference", () => {
  describe("FileReference", () => {
    describe("new FileReference()", () => {
      it("sets the path and the format of the referenced file", () => {
        const input = "authors/jane.yml";
        const expectedOutput = "yaml";

        const result = new FileReference(input);

        assert.equal(result.path, input);
        assert.equal(result.format, expectedOutput);
      });

      it("sets the format for each recognized extension", () => {
        const input = ["data/settings.json", "partials/intro.md", "partials/widget.html"];
        const expectedOutput = ["json", "markdown", "html"];

        const result = input.map((path) => new FileReference(path).format);

        assert.deepEqual(result, expectedOutput);
      });

      it("throws when the path has no extension", () => {
        const input = "authors/jane";

        assert.throws(() => new FileReference(input));
      });

      it("throws when the extension is unrecognized", () => {
        const input = "authors/jane.txt";

        assert.throws(() => new FileReference(input));
      });
    });

    describe("isAbsolute", () => {
      it("is true for a reference starting at the root", () => {
        const input = "/data/jane.yaml";

        const result = new FileReference(input);

        assert.equal(result.isAbsolute, true);
      });

      it("is false for a reference relative to its document", () => {
        const input = "data/jane.yaml";

        const result = new FileReference(input);

        assert.equal(result.isAbsolute, false);
      });
    });
  });
});
