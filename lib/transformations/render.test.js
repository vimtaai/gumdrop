import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Resource } from "../resources/resource.js";
import { renderContent } from "./render.js";

describe("render", () => {
  describe("renderContent()", () => {
    it("renders a Resource's Markdown content to HTML", async () => {
      const input = new Resource({ content: "# Heading" });
      const expectedOutput = '<h1 id="heading" tabindex="-1">Heading</h1>\n';

      const result = await renderContent(input);

      assert.equal(result.content, expectedOutput);
    });

    it("returns an .html resource unchanged", async () => {
      const input = new Resource({
        content: "<div>\n\n    <p>*Text*</p>\n</div>\n",
        path: "a.html",
      });

      const result = await renderContent(input);

      assert.equal(result, input);
    });

    it("preserves data", async () => {
      const input = new Resource({ data: { title: "My Document" }, content: "# Heading" });

      const result = await renderContent(input);

      assert.deepEqual(result.data, { title: "My Document" });
    });

    it("preserves path", async () => {
      const input = new Resource({ content: "# Heading", path: "pages/post.md" });

      const result = await renderContent(input);

      assert.equal(result.path, "pages/post.md");
    });
  });
});
