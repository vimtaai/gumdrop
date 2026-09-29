import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { FileReference } from "../references/reference.js";
import { Resource } from "../resources/resource.js";
import { parseData, parseFrontmatter } from "./parse.js";

describe("parse", () => {
  describe("parseFrontmatter()", () => {
    it("parses a mapping of fields into an object", async () => {
      const data = "title: My Document\n";
      const input = new Resource({ data });

      const result = await parseFrontmatter(input);

      assert.deepEqual(result, new Resource({ data: { title: "My Document" } }));
    });

    it("parses empty frontmatter into an empty object", async () => {
      const data = "";
      const input = new Resource({ data });

      const result = await parseFrontmatter(input);

      assert.deepEqual(result, new Resource({ data: {} }));
    });

    it("parses explicitly null frontmatter into an empty object", async () => {
      const data = "null\n";
      const input = new Resource({ data });

      const result = await parseFrontmatter(input);

      assert.deepEqual(result, new Resource({ data: {} }));
    });

    it("parses a tilde placeholder into an empty object", async () => {
      const data = "~\n";
      const input = new Resource({ data });

      const result = await parseFrontmatter(input);

      assert.deepEqual(result, new Resource({ data: {} }));
    });

    it("rejects frontmatter that is a scalar", async () => {
      const data = "just a string\n";
      const input = new Resource({ data });

      await assert.rejects(() => parseFrontmatter(input), /must be a mapping of fields/);
    });

    it("rejects frontmatter that is a sequence", async () => {
      const data = "- alpha\n- beta\n";
      const input = new Resource({ data });

      await assert.rejects(() => parseFrontmatter(input), /must be a mapping of fields/);
    });

    it("rejects frontmatter that is a single file reference", async () => {
      const data = "!file authors/jane.yaml\n";
      const input = new Resource({ data });

      await assert.rejects(() => parseFrontmatter(input), /must be a mapping of fields/);
    });

    it("names the parsed type in the error", async () => {
      const data = "- alpha\n- beta\n";
      const input = new Resource({ data });
      const expectedOutput = "Frontmatter must be a mapping of fields, got Array";

      await assert.rejects(() => parseFrontmatter(input), { message: expectedOutput });
    });

    it("preserves content", async () => {
      const data = "title: My Document\n";
      const input = new Resource({ data, content: "# Heading\n" });

      const result = await parseFrontmatter(input);

      assert.equal(result.content, "# Heading\n");
    });

    it("preserves path", async () => {
      const data = "title: My Document\n";
      const input = new Resource({ data, path: "pages/index.md" });

      const result = await parseFrontmatter(input);

      assert.equal(result.path, "pages/index.md");
    });
  });

  describe("parseData()", () => {
    it("parses raw YAML text into an object", async () => {
      const data = "title: My Document\n";
      const input = new Resource({ data, path: "data/author.yaml" });

      const result = await parseData(input);

      assert.deepEqual(
        result,
        new Resource({ data: { title: "My Document" }, path: "data/author.yaml" }),
      );
    });

    it("parses a top-level sequence into an array", async () => {
      const data = "- alpha\n- beta\n";
      const input = new Resource({ data, path: "data/tags.yaml" });

      const result = await parseData(input);

      assert.deepEqual(result.data, ["alpha", "beta"]);
    });

    it("parses a top-level scalar into that value", async () => {
      const data = "42\n";
      const input = new Resource({ data, path: "data/count.yaml" });

      const result = await parseData(input);

      assert.equal(result.data, 42);
    });

    it("parses a top-level file reference into a FileReference", async () => {
      const data = "!file authors/jane.yaml\n";
      const input = new Resource({ data, path: "data/ref.yaml" });

      const result = await parseData(input);

      assert.deepEqual(result.data, new FileReference("authors/jane.yaml"));
    });

    it("parses a .yml file as YAML", async () => {
      const data = "title: My Document\n";
      const input = new Resource({ data, path: "data/author.yml" });
      const expectedOutput = { title: "My Document" };

      const result = await parseData(input);

      assert.deepEqual(result.data, expectedOutput);
    });

    it("parses a .json file as JSON", async () => {
      const data = '{"title": "My Document"}';
      const input = new Resource({ data, path: "data/author.json" });
      const expectedOutput = { title: "My Document" };

      const result = await parseData(input);

      assert.deepEqual(result.data, expectedOutput);
    });

    it("rejects a path with no extension", async () => {
      const data = "title: My Document\n";
      const input = new Resource({ data, path: "data/author" });

      await assert.rejects(() => parseData(input), { message: 'No data parser for "data/author"' });
    });

    it("rejects an unrecognized extension", async () => {
      const data = "title: My Document\n";
      const input = new Resource({ data, path: "data/author.txt" });

      await assert.rejects(() => parseData(input), {
        message: 'No data parser for "data/author.txt"',
      });
    });

    it("rejects an extension naming an inherited object property", async () => {
      const data = "title: My Document\n";
      const input = new Resource({ data, path: "data/x.constructor" });

      await assert.rejects(() => parseData(input), {
        message: 'No data parser for "data/x.constructor"',
      });
    });

    it("preserves content", async () => {
      const data = "title: My Document\n";
      const input = new Resource({ data, content: "# Heading\n", path: "data/author.yaml" });

      const result = await parseData(input);

      assert.equal(result.content, "# Heading\n");
    });

    it("preserves path", async () => {
      const data = "title: My Document\n";
      const input = new Resource({ data, path: "data/author.yaml" });

      const result = await parseData(input);

      assert.equal(result.path, "data/author.yaml");
    });
  });
});
