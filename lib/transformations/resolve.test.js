import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { FileReference } from "../references/reference.js";
import { Resource } from "../resources/resource.js";
import { Transformer } from "../utils/transformer.js";
import { parseData } from "./parse.js";
import { renderContent } from "./render.js";
import { resolveReferences } from "./resolve.js";
import { splitFrontmatter } from "./split.js";

function createContext(loadFile) {
  const context = { dependencies: { loadFile }, transformers: {} };

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
      if (path === "bios/jane.yaml") {
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

  it("resolveReferences() throws when loadFile rejects", async () => {
    const input = new Resource({ data: { author: new FileReference("authors/missing.yaml") } });
    const loadFile = async () => {
      throw new Error("not found");
    };

    await assert.rejects(() => resolveReferences(input, createContext(loadFile)));
  });
});
