import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Resource } from "../resources/resource.js";
import { sanitizeContent } from "./sanitize.js";

describe("sanitize", () => {
  const context = { dependencies: { sanitize: (content) => content.toUpperCase() } };

  describe("sanitizeContent()", () => {
    it("passes content through the sanitizer from context", async () => {
      const input = new Resource({ content: "hello" });

      const result = await sanitizeContent(input, context);

      assert.equal(result.content, "HELLO");
    });

    it("preserves data", async () => {
      const input = new Resource({ data: { title: "My Document" }, content: "hello" });

      const result = await sanitizeContent(input, context);

      assert.deepEqual(result.data, { title: "My Document" });
    });

    it("preserves path", async () => {
      const input = new Resource({ content: "hello", path: "pages/post.md" });

      const result = await sanitizeContent(input, context);

      assert.equal(result.path, "pages/post.md");
    });
  });
});
