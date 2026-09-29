import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { FileReference } from "../references/reference.js";
import { Resource } from "../resources/resource.js";
import { parseData, parseFrontmatter } from "./parse.js";

describe("parse", () => {
  describe("parseFrontmatter()", () => {
    it("parses a mapping of fields into an object", async () => {
      const input = new Resource({ data: "title: My Document\n" });

      const result = await parseFrontmatter(input);

      assert.deepEqual(result, new Resource({ data: { title: "My Document" } }));
    });

    it("parses empty frontmatter into an empty object", async () => {
      const input = new Resource({ data: "" });

      const result = await parseFrontmatter(input);

      assert.deepEqual(result, new Resource({ data: {} }));
    });

    it("parses explicitly null frontmatter into an empty object", async () => {
      const input = new Resource({ data: "null\n" });

      const result = await parseFrontmatter(input);

      assert.deepEqual(result, new Resource({ data: {} }));
    });

    it("parses a tilde placeholder into an empty object", async () => {
      const input = new Resource({ data: "~\n" });

      const result = await parseFrontmatter(input);

      assert.deepEqual(result, new Resource({ data: {} }));
    });

    it("rejects frontmatter that is a scalar", async () => {
      const input = new Resource({ data: "just a string\n" });

      await assert.rejects(() => parseFrontmatter(input), /must be a mapping of fields/);
    });

    it("rejects frontmatter that is a sequence", async () => {
      const input = new Resource({ data: "- alpha\n- beta\n" });

      await assert.rejects(() => parseFrontmatter(input), /must be a mapping of fields/);
    });

    it("rejects frontmatter that is a single file reference", async () => {
      const input = new Resource({ data: "!file authors/jane.yaml\n" });

      await assert.rejects(() => parseFrontmatter(input), /must be a mapping of fields/);
    });

    it("names the parsed type in the error", async () => {
      const input = new Resource({ data: "- alpha\n- beta\n" });
      const expectedOutput = "Frontmatter must be a mapping of fields, got Array";

      await assert.rejects(() => parseFrontmatter(input), { message: expectedOutput });
    });

    it("preserves content", async () => {
      const input = new Resource({ data: "title: My Document\n", content: "# Heading\n" });

      const result = await parseFrontmatter(input);

      assert.equal(result.content, "# Heading\n");
    });

    it("preserves path", async () => {
      const input = new Resource({ data: "title: My Document\n", path: "pages/index.md" });

      const result = await parseFrontmatter(input);

      assert.equal(result.path, "pages/index.md");
    });
  });

  describe("parseData()", () => {
    it("parses raw YAML text into an object", async () => {
      const input = new Resource({ data: "title: My Document\n" });

      const result = await parseData(input);

      assert.deepEqual(result, new Resource({ data: { title: "My Document" } }));
    });

    it("parses a top-level sequence into an array", async () => {
      const input = new Resource({ data: "- alpha\n- beta\n" });

      const result = await parseData(input);

      assert.deepEqual(result.data, ["alpha", "beta"]);
    });

    it("parses a top-level scalar into that value", async () => {
      const input = new Resource({ data: "42\n" });

      const result = await parseData(input);

      assert.equal(result.data, 42);
    });

    it("parses a top-level file reference into a FileReference", async () => {
      const input = new Resource({ data: "!file authors/jane.yaml\n" });

      const result = await parseData(input);

      assert.deepEqual(result.data, new FileReference("authors/jane.yaml"));
    });

    it("preserves content", async () => {
      const input = new Resource({ data: "title: My Document\n", content: "# Heading\n" });

      const result = await parseData(input);

      assert.equal(result.content, "# Heading\n");
    });

    it("preserves path", async () => {
      const input = new Resource({ data: "title: My Document\n", path: "data/author.yaml" });

      const result = await parseData(input);

      assert.equal(result.path, "data/author.yaml");
    });
  });
});
