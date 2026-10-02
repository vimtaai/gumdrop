import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { FileReference } from "./reference.js";

describe("reference", () => {
  describe("FileReference", () => {
    describe("new FileReference()", () => {
      it("sets type to data for a data format", () => {
        const input = "authors/jane.yml";

        const result = new FileReference(input);

        assert.equal(result.path, input);
        assert.equal(result.type, "data");
        assert.equal(result.format, "yaml");
      });

      it("sets type to data for the json format", () => {
        const input = "data/settings.json";

        const result = new FileReference(input);

        assert.equal(result.type, "data");
        assert.equal(result.format, "json");
      });

      it("sets type to document for a document format", () => {
        const input = "partials/intro.md";

        const result = new FileReference(input);

        assert.equal(result.path, input);
        assert.equal(result.type, "document");
        assert.equal(result.format, "markdown");
      });

      it("sets type to document for the html format", () => {
        const input = "partials/widget.html";

        const result = new FileReference(input);

        assert.equal(result.type, "document");
        assert.equal(result.format, "html");
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
