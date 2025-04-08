import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { parseLocation } from "./location.js";

describe("parseLocation()", () => {
  describe("page", () => {
    it("returns `index` by default", () => {
      const location = new URL("http://test.url");
      const { page } = parseLocation(location);
      assert.strictEqual(page, "index");
    });

    it("returns given page", async () => {
      const location = new URL("http://test.url/#!page");
      const { page } = parseLocation(location);
      assert.strictEqual(page, "page");
    });

    it("ignores file extension", () => {
      const location = new URL("http://test.url/#!page.html");
      const { page } = parseLocation(location);
      assert.strictEqual(page, "page");
    });

    it("ignores leading `/`", async () => {
      const location = new URL("http://test.url/#!/page");
      const { page } = parseLocation(location);
      assert.strictEqual(page, "page");
    });

    it("ignores fragments", async () => {
      const location = new URL("http://test.url/#!/page#fragment");
      const { page } = parseLocation(location);
      assert.strictEqual(page, "page");
    });
  });

  describe("extension", () => {
    it("returns `md` by default", () => {
      const location = new URL("http://test.url");
      const { extension } = parseLocation(location);
      assert.strictEqual(extension, "md");
    });

    it("returns given extension", () => {
      const location = new URL("http://test.url/#!/page.html");
      const { extension } = parseLocation(location);
      assert.strictEqual(extension, "html");
    });
  });

  describe("fragment", () => {
    it("returns empty string by default", () => {
      const location = new URL("http://test.url/#!/page");
      const { fragment } = parseLocation(location);
      assert.strictEqual(fragment, "");
    });

    it("returns given fragment", () => {
      const location = new URL("http://test.url/#!/page#fragment");
      const { fragment } = parseLocation(location);
      assert.strictEqual(fragment, "fragment");
    });

    it("ignores additional `#` characters", () => {
      const location = new URL("http://test.url/#!/page#fragment#foo");
      const { fragment } = parseLocation(location);
      assert.strictEqual(fragment, "fragment#foo");
    });
  });
});
