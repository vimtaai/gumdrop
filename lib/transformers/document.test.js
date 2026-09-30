import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { JSDOM } from "jsdom";

import { createTestLoader } from "../../test/loaders.js";
import { Resource } from "../resources/resource.js";
import { createDocumentTransformer } from "./document.js";

describe("document", () => {
  const { window } = new JSDOM("");

  describe("createDocumentTransformer()", () => {
    it("splits frontmatter and resolves it as data", async () => {
      const input = new Resource({ content: "---\ntitle: My Document\n---\n# Heading\n" });
      const loadFile = mock.fn(async () => "");

      const result = await createDocumentTransformer({
        loader: createTestLoader(loadFile),
        window,
      }).transform(input);

      assert.deepEqual(result.data, { title: "My Document" });
      assert.equal(result.content, '<h1 id="heading" tabindex="-1">Heading</h1>\n');
    });

    it("resolves a `!file` reference found in the frontmatter", async () => {
      const input = new Resource({
        content: "---\nauthor: !file authors/jane.yaml\n---\n# Heading\n",
      });
      const loadFile = mock.fn(async () => "name: Jane Doe\n");

      const result = await createDocumentTransformer({
        loader: createTestLoader(loadFile),
        window,
      }).transform(input);

      assert.deepEqual(result.data, { author: { name: "Jane Doe" } });
      assert.equal(loadFile.mock.calls[0].arguments[0], "authors/jane.yaml");
    });

    it("handles content with no frontmatter block", async () => {
      const input = new Resource({ content: "# Heading\n" });
      const loadFile = mock.fn(async () => "");

      const result = await createDocumentTransformer({
        loader: createTestLoader(loadFile),
        window,
      }).transform(input);

      assert.deepEqual(result.data, {});
      assert.equal(result.content, '<h1 id="heading" tabindex="-1">Heading</h1>\n');
    });

    it("strips unsafe markup from the rendered content", async () => {
      const input = new Resource({ content: "# Heading\n\n<script>alert(1)</script>\n" });
      const loadFile = mock.fn(async () => "");

      const result = await createDocumentTransformer({
        loader: createTestLoader(loadFile),
        window,
      }).transform(input);

      assert.doesNotMatch(result.content, /<script>/);
    });

    it("resolves a circular reference to an [error, null] tuple", async () => {
      const input = new Resource({
        content: "---\nnext: !file a.yaml\n---\n# Heading\n",
        path: "start.md",
      });
      const loadFile = mock.fn(async (path) => {
        if (path === "a.yaml") {
          return "back: !file b.yaml\n";
        }
        return "back: !file a.yaml\n";
      });

      const [error, result] = await createDocumentTransformer({
        loader: createTestLoader(loadFile),
        window,
      }).transform.try(input);

      assert.match(error.message, /Circular file reference/);
      assert.equal(result, null);
    });

    it("resolves a failure to an [error, null] tuple via .transform.try()", async () => {
      const input = new Resource({
        content: "---\nauthor: !file authors/missing.yaml\n---\n# Heading\n",
      });
      const loadFile = async () => {
        throw new Error("not found");
      };

      const [error, result] = await createDocumentTransformer({
        loader: createTestLoader(loadFile),
        window,
      }).transform.try(input);

      assert.ok(error);
      assert.equal(result, null);
    });

    it("resolves non-mapping frontmatter to an [error, null] tuple", async () => {
      const input = new Resource({ content: "---\njust a string\n---\n# Heading\n" });
      const loadFile = mock.fn(async () => "");

      const [error, result] = await createDocumentTransformer({
        loader: createTestLoader(loadFile),
        window,
      }).transform.try(input);

      assert.match(error.message, /Frontmatter must be a mapping of fields/);
      assert.equal(result, null);
    });

    it("resolves a reference to a sequence file into an array", async () => {
      const input = new Resource({ content: "---\ntags: !file tags.yaml\n---\n# Heading\n" });
      const loadFile = mock.fn(async () => "- alpha\n- beta\n");

      const result = await createDocumentTransformer({
        loader: createTestLoader(loadFile),
        window,
      }).transform(input);

      assert.deepEqual(result.data, { tags: ["alpha", "beta"] });
    });

    it("inserts a Markdown partial where its field is output, rendering both once", async () => {
      const input = new Resource({
        content: "---\nintro: !file intro.md\n---\n# Main\n\n{{ intro }}\n",
      });
      const expectedOutput =
        '<h1 id="main" tabindex="-1">Main</h1>\n' +
        '<h2 id="intro" tabindex="-1">Intro</h2>\n' +
        "<p>Hello.</p>\n";
      const loadFile = mock.fn(async () => "## Intro\n\nHello.\n");

      const result = await createDocumentTransformer({
        loader: createTestLoader(loadFile),
        window,
      }).transform(input);

      assert.equal(result.content, expectedOutput);
    });

    it("keeps a blank line inside an inserted partial's code block", async () => {
      const input = new Resource({ content: "---\ncode: !file code.md\n---\n{{ code }}\n" });
      const expectedOutput = "<pre><code>if (a &lt; b) {\n\n}\n</code></pre>\n";
      const loadFile = mock.fn(async () => "```\nif (a < b) {\n\n}\n```\n");

      const result = await createDocumentTransformer({
        loader: createTestLoader(loadFile),
        window,
      }).transform(input);

      assert.equal(result.content, expectedOutput);
    });
  });
});
