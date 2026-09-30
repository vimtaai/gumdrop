import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { createTestLoader } from "../../test/loaders.js";
import { FileReference } from "../references/reference.js";
import { Resource } from "../resources/resource.js";
import { Transformer } from "../utils/transformer.js";
import { parseData, parseFrontmatter } from "./parse.js";
import { resolveReferences } from "./resolve.js";
import { splitFrontmatter } from "./split.js";

function createContext(loadFile, root = "") {
  const context = {
    dependencies: { loader: createTestLoader(loadFile), root },
    transformers: {},
    referenceChain: [],
  };

  const dataTransformer = new Transformer()
    .use(parseData)
    .use(resolveReferences)
    .setContext(context);

  const documentTransformer = new Transformer()
    .use(splitFrontmatter)
    .use(parseFrontmatter)
    .use(resolveReferences)
    .setContext(context);

  context.transformers.dataTransformer = dataTransformer;
  context.transformers.documentTransformer = documentTransformer;

  return context;
}

describe("resolve", () => {
  describe("resolveReferences()", () => {
    it("resolves a data reference via loadFile", async () => {
      const input = new Resource({ data: { author: new FileReference("authors/jane.yaml") } });
      const loadFile = mock.fn(async () => "name: Jane Doe\n");

      const result = await resolveReferences(input, createContext(loadFile));

      assert.deepEqual(result, new Resource({ data: { author: { name: "Jane Doe" } } }));
      assert.equal(loadFile.mock.calls[0].arguments[0], "authors/jane.yaml");
    });

    it("recursively resolves a reference found within a resolved data file", async () => {
      const input = new Resource({ data: { author: new FileReference("authors/jane.yaml") } });
      const loadFile = mock.fn(async (path) => {
        if (path === "authors/jane.yaml") {
          return "name: Jane Doe\nbio: !file bios/jane.yaml\n";
        }
        if (path === "authors/bios/jane.yaml") {
          return "text: A writer.\n";
        }
        throw new Error(`unexpected path: ${path}`);
      });

      const result = await resolveReferences(input, createContext(loadFile));

      assert.deepEqual(
        result,
        new Resource({ data: { author: { name: "Jane Doe", bio: { text: "A writer." } } } }),
      );
    });

    it("resolves a document reference into its source, without frontmatter", async () => {
      const input = new Resource({ data: { intro: new FileReference("partials/intro.md") } });
      const expectedOutput = "# Hello\n";
      const loadFile = mock.fn(async () => "---\ntitle: Intro\n---\n# Hello\n");

      const result = await resolveReferences(input, createContext(loadFile));

      assert.equal(result.data.intro, expectedOutput);
      assert.equal(loadFile.mock.calls[0].arguments[0], "partials/intro.md");
    });

    it("leaves non-reference values unchanged", async () => {
      const input = new Resource({ data: { title: "My Document" } });
      const loadFile = mock.fn(async () => "");

      const result = await resolveReferences(input, createContext(loadFile));

      assert.deepEqual(result, new Resource({ data: { title: "My Document" } }));
      assert.equal(loadFile.mock.callCount(), 0);
    });

    it("preserves content", async () => {
      const input = new Resource({ data: { title: "My Document" }, content: "# Heading\n" });
      const loadFile = mock.fn(async () => "");

      const result = await resolveReferences(input, createContext(loadFile));

      assert.equal(result.content, "# Heading\n");
    });

    it("resolves a reference against the directory of its own document", async () => {
      const input = new Resource({
        data: { author: new FileReference("../data/jane.yaml") },
        path: "pages/posts/first.md",
      });
      const expectedOutput = "pages/data/jane.yaml";
      const loadFile = mock.fn(async () => "name: Jane Doe\n");

      await resolveReferences(input, createContext(loadFile));

      assert.equal(loadFile.mock.calls[0].arguments[0], expectedOutput);
    });

    it("resolves a reference starting with a slash against the root", async () => {
      const input = new Resource({
        data: { author: new FileReference("/data/jane.yaml") },
        path: "pages/posts/first.md",
      });
      const expectedOutput = "/srv/site/data/jane.yaml";
      const loadFile = mock.fn(async () => "name: Jane Doe\n");

      await resolveReferences(input, createContext(loadFile, "/srv/site"));

      assert.equal(loadFile.mock.calls[0].arguments[0], expectedOutput);
    });

    it("resolves a nested reference against the directory of the file it came from", async () => {
      const input = new Resource({
        data: { author: new FileReference("data/jane.yaml") },
        path: "pages/post.md",
      });
      const expectedOutput = ["pages/data/jane.yaml", "pages/data/bios/jane.yaml"];
      const loadFile = mock.fn(async (path) => {
        if (path === "pages/data/jane.yaml") {
          return "name: Jane Doe\nbio: !file bios/jane.yaml\n";
        }
        return "text: A writer.\n";
      });

      await resolveReferences(input, createContext(loadFile));

      assert.deepEqual(
        loadFile.mock.calls.map((call) => call.arguments[0]),
        expectedOutput,
      );
    });

    it("preserves path", async () => {
      const input = new Resource({ data: { title: "My Document" }, path: "pages/post.md" });
      const loadFile = mock.fn(async () => "");

      const result = await resolveReferences(input, createContext(loadFile));

      assert.equal(result.path, "pages/post.md");
    });

    it("loads a file referenced twice in one document only once", async () => {
      const input = new Resource({
        data: {
          author: new FileReference("data/jane.yaml"),
          editor: new FileReference("data/jane.yaml"),
        },
      });
      const loadFile = mock.fn(async () => "name: Jane Doe\n");

      const result = await resolveReferences(input, createContext(loadFile));

      assert.deepEqual(result.data.author, { name: "Jane Doe" });
      assert.deepEqual(result.data.editor, { name: "Jane Doe" });
      assert.equal(loadFile.mock.callCount(), 1);
    });

    it("shares the loader's cache with the resolutions it recurses into", async () => {
      const input = new Resource({
        data: {
          intro: new FileReference("intro.md"),
          author: new FileReference("jane.yaml"),
        },
      });
      const expectedOutput = ["intro.md", "jane.yaml"];
      const loadFile = mock.fn(async (path) => {
        if (path === "intro.md") {
          return "---\nauthor: !file jane.yaml\n---\n# Hello\n";
        }
        return "name: Jane Doe\n";
      });

      await resolveReferences(input, createContext(loadFile));

      const loadedPaths = loadFile.mock.calls.map((call) => call.arguments[0]);
      assert.deepEqual(loadedPaths.toSorted(), expectedOutput);
    });

    it("rejects a document that references itself", async () => {
      const input = new Resource({
        data: { self: new FileReference("a.yaml") },
        path: "data/a.yaml",
      });
      const loadFile = mock.fn(async () => "self: !file a.yaml\n");

      await assert.rejects(
        () => resolveReferences(input, createContext(loadFile)),
        /Circular file reference/,
      );
    });

    it("rejects a cycle between two files", async () => {
      const input = new Resource({ data: { next: new FileReference("a.yaml") }, path: "start.md" });
      const loadFile = mock.fn(async (path) => {
        if (path === "a.yaml") {
          return "back: !file b.yaml\n";
        }
        return "back: !file a.yaml\n";
      });

      await assert.rejects(
        () => resolveReferences(input, createContext(loadFile)),
        /Circular file reference/,
      );
    });

    it("rejects a cycle spanning three files", async () => {
      const input = new Resource({ data: { next: new FileReference("a.yaml") }, path: "start.md" });
      const loadFile = mock.fn(async (path) => {
        if (path === "a.yaml") {
          return "next: !file b.yaml\n";
        }
        if (path === "b.yaml") {
          return "next: !file c.yaml\n";
        }
        return "next: !file a.yaml\n";
      });

      await assert.rejects(
        () => resolveReferences(input, createContext(loadFile)),
        /Circular file reference/,
      );
    });

    it("names the full chain in the circular reference error", async () => {
      const input = new Resource({ data: { next: new FileReference("a.yaml") }, path: "start.md" });
      const expectedOutput = "Circular file reference: start.md -> a.yaml -> b.yaml -> a.yaml";
      const loadFile = mock.fn(async (path) => {
        if (path === "a.yaml") {
          return "next: !file b.yaml\n";
        }
        return "back: !file a.yaml\n";
      });

      await assert.rejects(() => resolveReferences(input, createContext(loadFile)), {
        message: expectedOutput,
      });
    });

    it("resolves a diamond where two branches reach the same file", async () => {
      const input = new Resource({
        data: {
          left: new FileReference("b.yaml"),
          right: new FileReference("c.yaml"),
        },
        path: "start.md",
      });
      const loadFile = mock.fn(async (path) => {
        if (path === "b.yaml" || path === "c.yaml") {
          return "shared: !file d.yaml\n";
        }
        return "name: Jane Doe\n";
      });

      const result = await resolveReferences(input, createContext(loadFile));

      assert.deepEqual(result.data.left, { shared: { name: "Jane Doe" } });
      assert.deepEqual(result.data.right, { shared: { name: "Jane Doe" } });
      assert.equal(loadFile.mock.calls.filter((call) => call.arguments[0] === "d.yaml").length, 1);
    });

    it("stops loading as soon as a cycle is detected", async () => {
      const input = new Resource({ data: { next: new FileReference("a.yaml") }, path: "start.md" });
      const expectedOutput = 2;
      const loadFile = mock.fn(async (path) => {
        if (path === "a.yaml") {
          return "next: !file b.yaml\n";
        }
        return "back: !file a.yaml\n";
      });

      await assert.rejects(() => resolveReferences(input, createContext(loadFile)));

      assert.equal(loadFile.mock.callCount(), expectedOutput);
    });

    it("throws when loadFile rejects", async () => {
      const input = new Resource({ data: { author: new FileReference("authors/missing.yaml") } });
      const loadFile = async () => {
        throw new Error("not found");
      };

      await assert.rejects(() => resolveReferences(input, createContext(loadFile)));
    });

    it("leaves sequence data unchanged", async () => {
      const input = new Resource({ data: ["alpha", "beta"], path: "data/tags.yaml" });
      const expectedOutput = ["alpha", "beta"];
      const loadFile = mock.fn(async () => "");

      const result = await resolveReferences(input, createContext(loadFile));

      assert.deepEqual(result.data, expectedOutput);
    });

    it("leaves scalar data unchanged", async () => {
      const input = new Resource({ data: 42, path: "data/count.yaml" });
      const expectedOutput = 42;
      const loadFile = mock.fn(async () => "");

      const result = await resolveReferences(input, createContext(loadFile));

      assert.equal(result.data, expectedOutput);
    });

    it("resolves a reference to a sequence file into an array", async () => {
      const input = new Resource({ data: { tags: new FileReference("tags.yaml") } });
      const expectedOutput = ["alpha", "beta"];
      const loadFile = mock.fn(async () => "- alpha\n- beta\n");

      const result = await resolveReferences(input, createContext(loadFile));

      assert.deepEqual(result.data.tags, expectedOutput);
    });

    it("resolves a reference to a .json file into its value", async () => {
      const input = new Resource({ data: { settings: new FileReference("settings.json") } });
      const expectedOutput = { theme: "dark", columns: 2 };
      const loadFile = mock.fn(async () => '{"theme": "dark", "columns": 2}');

      const result = await resolveReferences(input, createContext(loadFile));

      assert.deepEqual(result.data.settings, expectedOutput);
    });

    it("returns the given resource when its data holds no reference", async () => {
      const input = new Resource({ data: { title: "My Document", tags: ["alpha"] } });
      const loadFile = mock.fn(async () => "");

      const result = await resolveReferences(input, createContext(loadFile));

      assert.equal(result, input);
    });

    it("resolves a reference inside a sequence", async () => {
      const input = new Resource({
        data: { authors: [new FileReference("jane.yaml"), new FileReference("john.yaml")] },
      });
      const expectedOutput = [{ name: "Jane" }, { name: "John" }];
      const loadFile = mock.fn(async (path) =>
        path === "jane.yaml" ? "name: Jane\n" : "name: John\n",
      );

      const result = await resolveReferences(input, createContext(loadFile));

      assert.deepEqual(result.data.authors, expectedOutput);
    });

    it("resolves a reference inside a nested mapping", async () => {
      const input = new Resource({
        data: { meta: { author: new FileReference("jane.yaml"), year: 2026 } },
      });
      const expectedOutput = { author: { name: "Jane" }, year: 2026 };
      const loadFile = mock.fn(async () => "name: Jane\n");

      const result = await resolveReferences(input, createContext(loadFile));

      assert.deepEqual(result.data.meta, expectedOutput);
    });

    it("resolves references at mixed depth", async () => {
      const input = new Resource({
        data: {
          chapters: [
            { title: "One", author: new FileReference("jane.yaml") },
            { title: "Two", authors: [new FileReference("john.yaml")] },
          ],
        },
      });
      const expectedOutput = [
        { title: "One", author: { name: "Jane" } },
        { title: "Two", authors: [{ name: "John" }] },
      ];
      const loadFile = mock.fn(async (path) =>
        path === "jane.yaml" ? "name: Jane\n" : "name: John\n",
      );

      const result = await resolveReferences(input, createContext(loadFile));

      assert.deepEqual(result.data.chapters, expectedOutput);
    });

    it("resolves a document reference inside a sequence into its source", async () => {
      const input = new Resource({ data: { sections: [new FileReference("intro.md")] } });
      const expectedOutput = ["# Hello\n"];
      const loadFile = mock.fn(async () => "# Hello\n");

      const result = await resolveReferences(input, createContext(loadFile));

      assert.deepEqual(result.data.sections, expectedOutput);
    });

    it("resolves the references of a sequence data file against its own directory", async () => {
      const input = new Resource({ data: { authors: new FileReference("people/authors.yaml") } });
      const expectedOutput = [{ name: "Jane" }];
      const loadFile = mock.fn(async (path) => {
        if (path === "people/authors.yaml") {
          return "- !file jane.yaml\n";
        }
        if (path === "people/jane.yaml") {
          return "name: Jane\n";
        }
        throw new Error(`unexpected path: ${path}`);
      });

      const result = await resolveReferences(input, createContext(loadFile));

      assert.deepEqual(result.data.authors, expectedOutput);
    });

    it("rejects a cycle reached through a nested reference", async () => {
      const input = new Resource({ data: { next: new FileReference("a.yaml") }, path: "start.md" });
      const loadFile = mock.fn(async () => "items:\n  - !file a.yaml\n");

      await assert.rejects(
        () => resolveReferences(input, createContext(loadFile)),
        /Circular file reference/,
      );
    });

    it("keeps a __proto__ key as a field", async () => {
      const data = Object.fromEntries([["__proto__", new FileReference("jane.yaml")]]);
      const input = new Resource({ data });
      const expectedOutput = { name: "Jane" };
      const loadFile = mock.fn(async () => "name: Jane\n");

      const result = await resolveReferences(input, createContext(loadFile));

      assert.ok(Object.hasOwn(result.data, "__proto__"));
      assert.deepEqual(
        Object.getOwnPropertyDescriptor(result.data, "__proto__").value,
        expectedOutput,
      );
      assert.equal(Object.getPrototypeOf(result.data), Object.prototype);
    });

    it("leaves a non-plain object untouched", async () => {
      const date = new Date("2026-01-01");
      const set = new Set(["alpha"]);
      const input = new Resource({ data: { date, set, author: new FileReference("jane.yaml") } });
      const loadFile = mock.fn(async () => "name: Jane\n");

      const result = await resolveReferences(input, createContext(loadFile));

      assert.equal(result.data.date, date);
      assert.equal(result.data.set, set);
    });
  });
});
