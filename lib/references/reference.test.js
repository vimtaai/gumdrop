import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { FileReference } from "./reference.js";

describe("reference", () => {
  describe("new FileReference()", () => {
    it("sets type to data for a data-shaped extension", () => {
      const input = "authors/jane.yaml";

      const result = new FileReference(input);

      assert.equal(result.path, input);
      assert.equal(result.type, "data");
      assert.equal(result.extension, "yaml");
    });

    it("sets type to data for a .json extension", () => {
      const input = "data/settings.json";

      const result = new FileReference(input);

      assert.equal(result.type, "data");
      assert.equal(result.extension, "json");
    });

    it("sets type to document for a document-shaped extension", () => {
      const input = "partials/intro.md";

      const result = new FileReference(input);

      assert.equal(result.path, input);
      assert.equal(result.type, "document");
      assert.equal(result.extension, "md");
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
