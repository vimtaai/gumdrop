import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { createTestLoader } from "../../test/loaders.js";
import { FileReference } from "../references/reference.js";
import { Resource } from "../resources/resource.js";
import { Transformer } from "../utils/transformer.js";
import { parseData } from "./parse.js";
import { renderContent } from "./render.js";
import { resolveReferences } from "./resolve.js";
import { splitFrontmatter } from "./split.js";

function createContext(loadFile, root = "") {
  const context = { dependencies: { loader: createTestLoader(loadFile), root }, transformers: {} };

  const dataTransformer = new Transformer()
    .use(parseData)
    .use(resolveReferences)
    .setContext(context);

  const documentTransformer = new Transformer()
    .use(splitFrontmatter)
    .use(parseData)
    .use(resolveReferences)
    .use(renderContent)
    .setContext(context);

  context.transformers.dataTransformer = dataTransformer;
  context.transformers.documentTransformer = documentTransformer;

  return context;
}

describe("resolve", () => {
  it("resolveReferences() resolves a data reference via loadFile", async () => {
    const input = new Resource({ data: { author: new FileReference("authors/jane.yaml") } });
    const loadFile = mock.fn(async () => "name: Jane Doe\n");

    const result = await resolveReferences(input, createContext(loadFile));

    assert.deepEqual(result, new Resource({ data: { author: { name: "Jane Doe" } } }));
    assert.equal(loadFile.mock.calls[0].arguments[0], "authors/jane.yaml");
  });

  it("resolveReferences() recursively resolves a reference found within a resolved data file", async () => {
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

  it("resolveReferences() resolves a document reference into a Resource", async () => {
    const input = new Resource({ data: { intro: new FileReference("partials/intro.md") } });
    const loadFile = mock.fn(async () => "---\ntitle: Intro\n---\n# Hello\n");

    const result = await resolveReferences(input, createContext(loadFile));

    assert.equal(result.data.intro.content, '<h1 id="hello" tabindex="-1">Hello</h1>\n');
    assert.deepEqual(result.data.intro.data, { title: "Intro" });
    assert.equal(loadFile.mock.calls[0].arguments[0], "partials/intro.md");
  });

  it("resolveReferences() leaves non-reference values unchanged", async () => {
    const input = new Resource({ data: { title: "My Document" } });
    const loadFile = mock.fn(async () => "");

    const result = await resolveReferences(input, createContext(loadFile));

    assert.deepEqual(result, new Resource({ data: { title: "My Document" } }));
    assert.equal(loadFile.mock.callCount(), 0);
  });

  it("resolveReferences() preserves content", async () => {
    const input = new Resource({ data: { title: "My Document" }, content: "# Heading\n" });
    const loadFile = mock.fn(async () => "");

    const result = await resolveReferences(input, createContext(loadFile));

    assert.equal(result.content, "# Heading\n");
  });

  it("resolveReferences() resolves a reference against the directory of its own document", async () => {
    const input = new Resource({
      data: { author: new FileReference("../data/jane.yaml") },
      path: "pages/posts/first.md",
    });
    const expectedOutput = "pages/data/jane.yaml";
    const loadFile = mock.fn(async () => "name: Jane Doe\n");

    await resolveReferences(input, createContext(loadFile));

    assert.equal(loadFile.mock.calls[0].arguments[0], expectedOutput);
  });

  it("resolveReferences() resolves a reference starting with a slash against the root", async () => {
    const input = new Resource({
      data: { author: new FileReference("/data/jane.yaml") },
      path: "pages/posts/first.md",
    });
    const expectedOutput = "/srv/site/data/jane.yaml";
    const loadFile = mock.fn(async () => "name: Jane Doe\n");

    await resolveReferences(input, createContext(loadFile, "/srv/site"));

    assert.equal(loadFile.mock.calls[0].arguments[0], expectedOutput);
  });

  it("resolveReferences() resolves a nested reference against the directory of the file it came from", async () => {
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

  it("resolveReferences() stamps the resolved path on a resolved document", async () => {
    const input = new Resource({
      data: { intro: new FileReference("partials/intro.md") },
      path: "pages/post.md",
    });
    const expectedOutput = "pages/partials/intro.md";
    const loadFile = mock.fn(async () => "# Hello\n");

    const result = await resolveReferences(input, createContext(loadFile));

    assert.equal(result.data.intro.path, expectedOutput);
  });

  it("resolveReferences() preserves path", async () => {
    const input = new Resource({ data: { title: "My Document" }, path: "pages/post.md" });
    const loadFile = mock.fn(async () => "");

    const result = await resolveReferences(input, createContext(loadFile));

    assert.equal(result.path, "pages/post.md");
  });

  it("resolveReferences() loads a file referenced twice in one document only once", async () => {
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

  it("resolveReferences() shares the loader's cache with the resolutions it recurses into", async () => {
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

  it("resolveReferences() throws when loadFile rejects", async () => {
    const input = new Resource({ data: { author: new FileReference("authors/missing.yaml") } });
    const loadFile = async () => {
      throw new Error("not found");
    };

    await assert.rejects(() => resolveReferences(input, createContext(loadFile)));
  });
});
