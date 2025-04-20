import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { parseLocation, parseHashBang } from "./location.js";

describe("parseLocation()", () => {
  describe(".baseUrl", () => {
    it("returns empty string if the index.html file is in the web root", async () => {
      const location = new URL("http://test.url/");
      const { baseUrl } = parseLocation(location);
      assert.strictEqual(baseUrl, "http://test.url");
    });

    it("returns the folder the current location", async () => {
      const location = new URL("http://test.url/dir/");
      const { baseUrl } = parseLocation(location);
      assert.strictEqual(baseUrl, "http://test.url/dir");
    });

    it("ignores filename in path", async () => {
      const location = new URL("http://test.url/dir/index.html");
      const { baseUrl } = parseLocation(location);
      assert.strictEqual(baseUrl, "http://test.url/dir");
    });

    it("ignores origin for `file://` protocol", () => {
      const location = new URL("file:///root/dir/index.html");
      const { baseUrl } = parseLocation(location);
      assert.strictEqual(baseUrl, "/root/dir");
    });
  });

  describe(".hashBang", () => {
    it("returns empty string by default", async () => {
      const location = new URL("http://test.url/");
      const { hashBang } = parseLocation(location);
      assert.strictEqual(hashBang, "");
    });

    it("returns the given hashbang", async () => {
      const location = new URL("http://test.url/#!hashbang");
      const { hashBang } = parseLocation(location);
      assert.strictEqual(hashBang, "hashbang");
    });

    it("ignores leading `/`", async () => {
      const location = new URL("http://test.url/#!/hashbang");
      const { hashBang } = parseLocation(location);
      assert.strictEqual(hashBang, "hashbang");
    });

    it("returns the given fragment if there is no hashbang", async () => {
      const location = new URL("http://test.url/#fragment");
      const { hashBang } = parseLocation(location);
      assert.strictEqual(hashBang, "#fragment");
    });
  });
});

describe("parseHash()", () => {
  describe(".page", () => {
    it("returns `index` by default", () => {
      const hashBang = "";
      const { page } = parseHashBang(hashBang);
      assert.strictEqual(page, "index");
    });

    it("returns given page", async () => {
      const hashBang = "page";
      const { page } = parseHashBang(hashBang);
      assert.strictEqual(page, "page");
    });

    it("ignores file extension", () => {
      const hashBang = "page.html";
      const { page } = parseHashBang(hashBang);
      assert.strictEqual(page, "page");
    });

    it("ignores fragments", async () => {
      const hashBang = "page#fragment";
      const { page } = parseHashBang(hashBang);
      assert.strictEqual(page, "page");
    });
  });

  describe(".extension", () => {
    it("returns `md` by default", () => {
      const hashBang = "";
      const { extension } = parseHashBang(hashBang);
      assert.strictEqual(extension, "md");
    });

    it("returns given extension", () => {
      const hashBang = "page.html";
      const { extension } = parseHashBang(hashBang);
      assert.strictEqual(extension, "html");
    });
  });

  describe(".fragment", () => {
    it("returns empty string by default", () => {
      const hashBang = "page";
      const { fragment } = parseHashBang(hashBang);
      assert.strictEqual(fragment, "");
    });

    it("returns given fragment", () => {
      const hashBang = "page#fragment";
      const { fragment } = parseHashBang(hashBang);
      assert.strictEqual(fragment, "fragment");
    });

    it("ignores additional `#` characters", () => {
      const hashBang = "page#fragment#foo";
      const { fragment } = parseHashBang(hashBang);
      assert.strictEqual(fragment, "fragment#foo");
    });
  });
});
