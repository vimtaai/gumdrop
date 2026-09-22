import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { JSDOM } from "jsdom";

import { createTestLoader } from "../../test/loaders.js";
import { Resource } from "../resources/resource.js";
import { createDocumentTransformer } from "./document.js";

describe("document", () => {
  const { window } = new JSDOM("");

  it("createDocumentTransformer() splits frontmatter and resolves it as data", async () => {
    const input = new Resource({ content: "---\ntitle: My Document\n---\n# Heading\n" });
    const loadFile = mock.fn(async () => "");

    const result = await createDocumentTransformer({
      loader: createTestLoader(loadFile),
      window,
    }).transform(input);

    assert.deepEqual(result.data, { title: "My Document" });
    assert.equal(result.content, '<h1 id="heading" tabindex="-1">Heading</h1>\n');
  });

  it("createDocumentTransformer() resolves a `!file` reference found in the frontmatter", async () => {
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

  it("createDocumentTransformer() handles content with no frontmatter block", async () => {
    const input = new Resource({ content: "# Heading\n" });
    const loadFile = mock.fn(async () => "");

    const result = await createDocumentTransformer({
      loader: createTestLoader(loadFile),
      window,
    }).transform(input);

    assert.deepEqual(result.data, {});
    assert.equal(result.content, '<h1 id="heading" tabindex="-1">Heading</h1>\n');
  });

  it("createDocumentTransformer() strips unsafe markup from the rendered content", async () => {
    const input = new Resource({ content: "# Heading\n\n<script>alert(1)</script>\n" });
    const loadFile = mock.fn(async () => "");

    const result = await createDocumentTransformer({
      loader: createTestLoader(loadFile),
      window,
    }).transform(input);

    assert.doesNotMatch(result.content, /<script>/);
  });

  it("createDocumentTransformer() resolves a circular reference to an [error, null] tuple", async () => {
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

  it("createDocumentTransformer() resolves a failure to an [error, null] tuple via .transform.try()", async () => {
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
});
