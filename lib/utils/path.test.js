import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { getPathDirectory, getPathExtension, isPathAbsolute, resolvePath } from "./path.js";

describe("path", () => {
  describe("getPathDirectory()", () => {
    it("returns the directory a path lives in", () => {
      const input = "pages/posts/first.md";
      const expectedOutput = "pages/posts";

      const result = getPathDirectory(input);

      assert.equal(result, expectedOutput);
    });

    it("returns an empty string for a path with no directory", () => {
      const input = "index.md";
      const expectedOutput = "";

      const result = getPathDirectory(input);

      assert.equal(result, expectedOutput);
    });

    it("returns the root for a path directly below it", () => {
      const input = "/index.md";
      const expectedOutput = "/";

      const result = getPathDirectory(input);

      assert.equal(result, expectedOutput);
    });

    it("returns the full directory of an absolute path", () => {
      const input = "/srv/site/data/authors.yaml";
      const expectedOutput = "/srv/site/data";

      const result = getPathDirectory(input);

      assert.equal(result, expectedOutput);
    });
  });

  describe("getPathExtension()", () => {
    it("returns the extension of a path", () => {
      const input = "data/settings.json";
      const expectedOutput = "json";

      const result = getPathExtension(input);

      assert.equal(result, expectedOutput);
    });

    it("returns an empty string for a path with no extension", () => {
      const input = "authors/jane";
      const expectedOutput = "";

      const result = getPathExtension(input);

      assert.equal(result, expectedOutput);
    });

    it("returns only the last extension", () => {
      const input = "archive.tar.gz";
      const expectedOutput = "gz";

      const result = getPathExtension(input);

      assert.equal(result, expectedOutput);
    });

    it("ignores a dot in a directory name", () => {
      const input = "data/v1.2/authors";
      const expectedOutput = "";

      const result = getPathExtension(input);

      assert.equal(result, expectedOutput);
    });
  });

  describe("isPathAbsolute()", () => {
    it("returns true for a path starting at the root", () => {
      const input = "/srv/site/data/authors.yaml";

      const result = isPathAbsolute(input);

      assert.equal(result, true);
    });

    it("returns false for a path relative to its document", () => {
      const input = "data/authors.yaml";

      const result = isPathAbsolute(input);

      assert.equal(result, false);
    });

    it("returns false for an empty path", () => {
      const input = "";

      const result = isPathAbsolute(input);

      assert.equal(result, false);
    });
  });

  describe("resolvePath()", () => {
    it("joins a path onto its base", () => {
      const base = "pages";
      const input = "authors/jane.yaml";
      const expectedOutput = "pages/authors/jane.yaml";

      const result = resolvePath(base, input);

      assert.equal(result, expectedOutput);
    });

    it("walks up out of the base for each leading ..", () => {
      const base = "pages/posts";
      const input = "../../data/authors.yaml";
      const expectedOutput = "data/authors.yaml";

      const result = resolvePath(base, input);

      assert.equal(result, expectedOutput);
    });

    it("drops . segments", () => {
      const base = "pages";
      const input = "./authors/./jane.yaml";
      const expectedOutput = "pages/authors/jane.yaml";

      const result = resolvePath(base, input);

      assert.equal(result, expectedOutput);
    });

    it("returns the path unchanged for an empty base", () => {
      const base = "";
      const input = "authors/jane.yaml";
      const expectedOutput = "authors/jane.yaml";

      const result = resolvePath(base, input);

      assert.equal(result, expectedOutput);
    });

    it("keeps an absolute base absolute", () => {
      const base = "/srv/site";
      const input = "data/prices.csv";
      const expectedOutput = "/srv/site/data/prices.csv";

      const result = resolvePath(base, input);

      assert.equal(result, expectedOutput);
    });

    it("collapses repeated separators", () => {
      const base = "/srv/site/";
      const input = "/data/prices.csv";
      const expectedOutput = "/srv/site/data/prices.csv";

      const result = resolvePath(base, input);

      assert.equal(result, expectedOutput);
    });

    it("clamps .. at the root of an absolute base", () => {
      const base = "/srv";
      const input = "../../etc/passwd";
      const expectedOutput = "/etc/passwd";

      const result = resolvePath(base, input);

      assert.equal(result, expectedOutput);
    });

    it("keeps .. that walks above a relative base", () => {
      const base = "pages";
      const input = "../../data/authors.yaml";
      const expectedOutput = "../data/authors.yaml";

      const result = resolvePath(base, input);

      assert.equal(result, expectedOutput);
    });

    it("stacks .. segments that walk further above a relative base", () => {
      const base = "pages";
      const input = "../../../../data/authors.yaml";
      const expectedOutput = "../../../data/authors.yaml";

      const result = resolvePath(base, input);

      assert.equal(result, expectedOutput);
    });
  });
});
