import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Resource } from "../resources/resource.js";
import { splitFrontmatter } from "./split.js";

describe("split", () => {
  describe("splitFrontmatter()", () => {
    it("splits content into frontmatter text and body", async () => {
      const input = new Resource({ content: "---\ntitle: My Document\n---\n# Heading\n" });

      const result = await splitFrontmatter(input);

      assert.deepEqual(
        result,
        new Resource({ data: "title: My Document", content: "# Heading\n" }),
      );
    });

    it("preserves a multi-line body", async () => {
      const input = new Resource({
        content: "---\ntitle: My Document\n---\n# Heading\n\nMore text.\n",
      });

      const result = await splitFrontmatter(input);

      assert.deepEqual(
        result,
        new Resource({ data: "title: My Document", content: "# Heading\n\nMore text.\n" }),
      );
    });

    it("returns empty data and the original content without a frontmatter block", async () => {
      const input = new Resource({ content: "# Heading\n" });

      const result = await splitFrontmatter(input);

      assert.deepEqual(result, new Resource({ data: "", content: "# Heading\n" }));
    });

    it("preserves path", async () => {
      const input = new Resource({ content: "# Heading\n", path: "pages/post.md" });

      const result = await splitFrontmatter(input);

      assert.equal(result.path, "pages/post.md");
    });
  });
});
