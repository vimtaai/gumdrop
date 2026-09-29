import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Resource } from "./resource.js";

describe("resource", () => {
  describe("new Resource()", () => {
    it("defaults data, content and path to empty strings", () => {
      const result = new Resource();

      assert.equal(result.data, "");
      assert.equal(result.content, "");
      assert.equal(result.path, "");
    });

    it("sets data, content and path from the given options", () => {
      const input = {
        data: { title: "My Document" },
        content: "# Heading\n",
        path: "pages/post.md",
      };

      const result = new Resource(input);

      assert.equal(result.data, input.data);
      assert.equal(result.content, input.content);
      assert.equal(result.path, input.path);
    });

    it("defaults content when only data is given", () => {
      const input = { data: { title: "My Document" } };

      const result = new Resource(input);

      assert.equal(result.data, input.data);
      assert.equal(result.content, "");
    });
  });

  describe("directory", () => {
    it("returns the directory the resource lives in", () => {
      const input = { path: "pages/posts/first.md" };
      const expectedOutput = "pages/posts";

      const result = new Resource(input);

      assert.equal(result.directory, expectedOutput);
    });

    it("returns an empty string for a resource with no path", () => {
      const expectedOutput = "";

      const result = new Resource();

      assert.equal(result.directory, expectedOutput);
    });
  });

  describe("extension", () => {
    it("returns the extension of the resource's path", () => {
      const input = { path: "data/settings.json" };
      const expectedOutput = "json";

      const result = new Resource(input);

      assert.equal(result.extension, expectedOutput);
    });

    it("returns an empty string for a resource with no path", () => {
      const expectedOutput = "";

      const result = new Resource();

      assert.equal(result.extension, expectedOutput);
    });
  });
});
