import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { FileReference } from "./reference.js";

describe("reference", () => {
  it("new FileReference() sets type to data for a data-shaped extension", () => {
    const input = "authors/jane.yaml";

    const result = new FileReference(input);

    assert.equal(result.path, input);
    assert.equal(result.type, "data");
    assert.equal(result.extension, "yaml");
  });

  it("new FileReference() sets type to document for a document-shaped extension", () => {
    const input = "partials/intro.md";

    const result = new FileReference(input);

    assert.equal(result.path, input);
    assert.equal(result.type, "document");
    assert.equal(result.extension, "md");
  });

  it("new FileReference() throws when the path has no extension", () => {
    const input = "authors/jane";

    assert.throws(() => new FileReference(input));
  });

  it("new FileReference() throws when the extension is unrecognized", () => {
    const input = "authors/jane.txt";

    assert.throws(() => new FileReference(input));
  });
});
