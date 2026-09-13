import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { parseFrontmatter } from "./frontmatter.js";

describe("frontmatter", () => {
  it("parseFrontmatter() splits YAML frontmatter from the document body", () => {
    const input = "---\ntitle: My Document\n---\n# Heading\n";
    const expectedOutput = { data: { title: "My Document" }, body: "# Heading\n" };

    const result = parseFrontmatter(input);

    assert.deepEqual(result, expectedOutput);
  });

  it("parseFrontmatter() returns an empty data object when there is no frontmatter", () => {
    const input = "# Heading\n";
    const expectedOutput = { data: {}, body: "# Heading\n" };

    const result = parseFrontmatter(input);

    assert.deepEqual(result, expectedOutput);
  });

  it("parseFrontmatter() throws on malformed YAML frontmatter", () => {
    const input = "---\ntitle: [unterminated\n---\nbody\n";

    assert.throws(() => parseFrontmatter(input));
  });

  it("parseFrontmatter() resolves a failure to an [error, null] tuple via .try()", async () => {
    const input = "---\ntitle: [unterminated\n---\nbody\n";

    const [error, result] = await parseFrontmatter.try(input);

    assert.ok(error);
    assert.equal(result, null);
  });
});
