import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { JSDOM } from "jsdom";

import { createTestLoader } from "../../test/loaders.js";
import { Resource } from "../resources/resource.js";
import { createDocumentTransformers } from "./document.js";

describe("document", () => {
  const { window } = new JSDOM("");

  describe("createDocumentTransformers()", () => {
    it("splits frontmatter and resolves it as data", async () => {
      const input = new Resource({ content: "---\ntitle: My Document\n---\n# Heading\n" });
      const loadFile = mock.fn(async () => "");

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform(input);

      assert.deepEqual(result.data, { title: "My Document" });
      assert.equal(result.content, '<h1 id="heading" tabindex="-1">Heading</h1>\n');
    });

    it("resolves a `!file` reference found in the frontmatter", async () => {
      const input = new Resource({
        content: "---\nauthor: !file authors/jane.yaml\n---\n# Heading\n",
      });
      const loadFile = mock.fn(async () => "name: Jane Doe\n");

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform(input);

      assert.deepEqual(result.data, { author: { name: "Jane Doe" } });
      assert.equal(loadFile.mock.calls[0].arguments[0], "authors/jane.yaml");
    });

    it("handles content with no frontmatter block", async () => {
      const input = new Resource({ content: "# Heading\n" });
      const loadFile = mock.fn(async () => "");

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform(input);

      assert.deepEqual(result.data, {});
      assert.equal(result.content, '<h1 id="heading" tabindex="-1">Heading</h1>\n');
    });

    it("strips unsafe markup from the rendered content", async () => {
      const input = new Resource({ content: "# Heading\n\n<script>alert(1)</script>\n" });
      const loadFile = mock.fn(async () => "");

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform(input);

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

      const [error, result] = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform.try(input);

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

      const [error, result] = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform.try(input);

      assert.ok(error);
      assert.equal(result, null);
    });

    it("resolves non-mapping frontmatter to an [error, null] tuple", async () => {
      const input = new Resource({ content: "---\njust a string\n---\n# Heading\n" });
      const loadFile = mock.fn(async () => "");

      const [error, result] = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform.try(input);

      assert.match(error.message, /Frontmatter must be a mapping of fields/);
      assert.equal(result, null);
    });

    it("resolves a reference to a sequence file into an array", async () => {
      const input = new Resource({ content: "---\ntags: !file tags.yaml\n---\n# Heading\n" });
      const loadFile = mock.fn(async () => "- alpha\n- beta\n");

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform(input);

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

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform(input);

      assert.equal(result.content, expectedOutput);
    });

    it("keeps a blank line inside an inserted partial's code block", async () => {
      const input = new Resource({ content: "---\ncode: !file code.md\n---\n{{ code }}\n" });
      const expectedOutput = "<pre><code>if (a &lt; b) {\n\n}\n</code></pre>\n";
      const loadFile = mock.fn(async () => "```\nif (a < b) {\n\n}\n```\n");

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform(input);

      assert.equal(result.content, expectedOutput);
    });

    it("inserts each partial of a list in a for loop", async () => {
      const input = new Resource({
        content:
          "---\nsections: [!file one.md, !file two.md]\n---\n" +
          "{% for section in sections %}{{ section }}\n{% endfor %}",
      });
      const expectedOutput =
        '<h2 id="one" tabindex="-1">One</h2>\n<h2 id="two" tabindex="-1">Two</h2>\n';
      const loadFile = mock.fn(async (path) => (path === "one.md" ? "## One\n" : "## Two\n"));

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform(input);

      assert.equal(result.content, expectedOutput);
    });

    it("renders a loop as a loose list when its tags keep their newlines", async () => {
      const input = new Resource({
        content: "---\nauthors: [Jane, John]\n---\n{% for a in authors %}\n- {{ a }}\n{% endfor %}",
      });
      const expectedOutput = "<ul>\n<li>\n<p>Jane</p>\n</li>\n<li>\n<p>John</p>\n</li>\n</ul>\n";
      const loadFile = mock.fn(async () => "");

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform(input);

      assert.equal(result.content, expectedOutput);
    });

    it("renders a loop as a tight list when its tag trims with -%}", async () => {
      const input = new Resource({
        content:
          "---\nauthors: [Jane, John]\n---\n{% for a in authors -%}\n- {{ a }}\n{% endfor %}",
      });
      const expectedOutput = "<ul>\n<li>Jane</li>\n<li>John</li>\n</ul>\n";
      const loadFile = mock.fn(async () => "");

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform(input);

      assert.equal(result.content, expectedOutput);
    });

    it("templates a partial with its own frontmatter before inserting it", async () => {
      const input = new Resource({ content: "---\nintro: !file intro.md\n---\n{{ intro }}\n" });
      const expectedOutput = "<p>Hello Jane.</p>\n";
      const loadFile = mock.fn(async () => "---\nname: Jane\n---\nHello {{ name }}.\n");

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform(input);

      assert.equal(result.content, expectedOutput);
    });

    it("does not expose the including document's data to a partial", async () => {
      const input = new Resource({
        content: "---\nname: Parent\nintro: !file intro.md\n---\n{{ intro }}\n",
      });
      const expectedOutput = "<p>Hello .</p>\n";
      const loadFile = mock.fn(async () => "Hello {{ name }}.\n");

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform(input);

      assert.equal(result.content, expectedOutput);
    });

    it("renders a Markdown partial nested in an HTML partial", async () => {
      const input = new Resource({
        content: "---\nwidget: !file widget.html\n---\n{{ widget }}\n",
      });
      const expectedOutput = "<div><p><em>Hi</em></p>\n</div>\n";
      const loadFile = mock.fn(async (path) =>
        path === "widget.html" ? "---\nnote: !file note.md\n---\n<div>{{ note }}</div>" : "*Hi*\n",
      );

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform(input);

      assert.equal(result.content, expectedOutput);
    });

    it("inserts a nested partial, resolved relative to the partial referencing it", async () => {
      const input = new Resource({
        content: "---\nchapter: !file chapters/one.md\n---\n{{ chapter }}",
        path: "book.md",
      });
      const expectedOutput = '<h2 id="one" tabindex="-1">One</h2>\n<p><em>Note</em></p>\n';
      const loadFile = mock.fn(async (path) => {
        if (path === "chapters/one.md") {
          return "---\nnote: !file note.md\n---\n## One\n\n{{ note }}";
        }
        if (path === "chapters/note.md") {
          return "*Note*\n";
        }
        throw new Error(`unexpected path: ${path}`);
      });

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform(input);

      assert.equal(result.content, expectedOutput);
    });

    it("resolves partials that reference each other to an [error, null] tuple", async () => {
      const input = new Resource({
        content: "---\nnext: !file a.md\n---\n{{ next }}",
        path: "start.md",
      });
      const loadFile = mock.fn(async (path) =>
        path === "a.md"
          ? "---\nnext: !file b.md\n---\n{{ next }}"
          : "---\nnext: !file a.md\n---\n{{ next }}",
      );

      const [error, result] = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).markdown.transform.try(input);

      assert.match(error.message, /Circular file reference: start.md -> a.md -> b.md -> a.md/);
      assert.equal(result, null);
    });

    it("templates and sanitizes the document without rendering Markdown", async () => {
      const input = new Resource({
        content:
          "---\ntitle: Page\n---\n<div>\n  <h1>{{ title }}</h1>\n\n    <p>*Text*</p>\n</div>\n",
        path: "page.html",
      });
      const expectedOutput = "<div>\n  <h1>Page</h1>\n\n    <p>*Text*</p>\n</div>\n";
      const loadFile = mock.fn(async () => "");

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).html.transform(input);

      assert.equal(result.content, expectedOutput);
    });

    it("renders a Markdown partial nested in a Markdown partial only once", async () => {
      const input = new Resource({
        content: "---\nchapter: !file chapter.md\n---\n<main>\n{{ chapter }}</main>\n",
        path: "page.html",
      });
      const expectedOutput = "<main>\n<p>Note: *literal*</p>\n</main>\n";
      const loadFile = mock.fn(async (path) =>
        path === "chapter.md" ? "---\nnote: !file note.md\n---\nNote: {{ note }}" : "\\*literal\\*",
      );

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).html.transform(input);

      assert.equal(result.content, expectedOutput);
    });

    it("inserts an HTML partial into an HTML document as-is", async () => {
      const input = new Resource({
        content: "---\nwidget: !file widget.html\n---\n<main>\n{{ widget }}\n</main>\n",
        path: "page.html",
      });
      const expectedOutput = "<main>\n<div>\n\n    <p>*Hi*, Jane</p>\n</div>\n</main>\n";
      const loadFile = mock.fn(
        async () => "---\nname: Jane\n---\n<div>\n\n    <p>*Hi*, {{ name }}</p>\n</div>",
      );

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).html.transform(input);

      assert.equal(result.content, expectedOutput);
    });

    it("renders a Markdown partial to HTML when inserting it into an HTML document", async () => {
      const input = new Resource({
        content: "---\nintro: !file intro.md\n---\n<main>\n{{ intro }}</main>\n",
        path: "page.html",
      });
      const expectedOutput = "<main>\n<p><em>Hi</em>, Jane</p>\n</main>\n";
      const loadFile = mock.fn(async () => "---\nname: Jane\n---\n*Hi*, {{ name }}\n");

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).html.transform(input);

      assert.equal(result.content, expectedOutput);
    });

    it("renders a Markdown partial reached through a data file for an HTML document", async () => {
      const input = new Resource({
        content: "---\nauthor: !file jane.yaml\n---\n<main>\n{{ author.bio }}</main>\n",
        path: "page.html",
      });
      const expectedOutput = "<main>\n<p><em>Writer</em></p>\n</main>\n";
      const loadFile = mock.fn(async (path) =>
        path === "jane.yaml" ? "bio: !file bio.md\n" : "*Writer*\n",
      );

      const result = await createDocumentTransformers({
        loader: createTestLoader(loadFile),
        window,
      }).html.transform(input);

      assert.equal(result.content, expectedOutput);
    });
  });
});
