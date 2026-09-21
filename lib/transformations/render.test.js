import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Resource } from "../resources/resource.js";
import { renderContent } from "./render.js";

describe("render", () => {
  it("renderContent() renders a Resource's Markdown content to HTML", async () => {
    const input = new Resource({ content: "# Heading" });
    const expectedOutput = '<h1 id="heading" tabindex="-1">Heading</h1>\n';

    const result = await renderContent(input);

    assert.equal(result.content, expectedOutput);
  });

  it("renderContent() preserves data", async () => {
    const input = new Resource({ data: { title: "My Document" }, content: "# Heading" });

    const result = await renderContent(input);

    assert.deepEqual(result.data, { title: "My Document" });
  });

  it("renderContent() preserves path", async () => {
    const input = new Resource({ content: "# Heading", path: "pages/post.md" });

    const result = await renderContent(input);

    assert.equal(result.path, "pages/post.md");
  });
});
