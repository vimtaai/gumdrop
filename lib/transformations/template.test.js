import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Resource } from "../resources/resource.js";
import { renderTemplate } from "./template.js";

describe("template", () => {
  describe("renderTemplate()", () => {
    it("renders a Resource's content as a Liquid template over its data", async () => {
      const input = new Resource({ data: { title: "My Document" }, content: "# {{ title }}\n" });
      const expectedOutput = "# My Document\n";

      const result = await renderTemplate(input);

      assert.equal(result.content, expectedOutput);
    });

    it("preserves data", async () => {
      const input = new Resource({ data: { title: "My Document" }, content: "# {{ title }}\n" });

      const result = await renderTemplate(input);

      assert.deepEqual(result.data, { title: "My Document" });
    });

    it("preserves path", async () => {
      const input = new Resource({ data: {}, content: "# Heading\n", path: "pages/post.md" });

      const result = await renderTemplate(input);

      assert.equal(result.path, "pages/post.md");
    });
  });
});
