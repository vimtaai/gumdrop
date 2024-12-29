import { strict as assert } from "node:assert";
import { beforeEach, describe, it } from "node:test";

import { mockFetch, mockUrl } from "../test/helpers.js";
import { NetworkError, NotFoundError, ServerError } from "./errors.js";
import { loadPage, navigate } from "./navigation.js";

describe("Navigation", () => {
  describe("loadPage()", () => {
    it("loads `index` page by default", async () => {
      mockUrl("http://test.url");
      mockFetch();

      await loadPage("");

      const fetchCall = window.fetch.mock.calls[0];
      assert.strictEqual(fetchCall.arguments[0], "http://test.url/index.md");
    });

    it("loads given page if specified", async () => {
      mockUrl("http://test.url");
      mockFetch();

      await loadPage("page");

      const fetchCall = window.fetch.mock.calls[0];
      assert.strictEqual(fetchCall.arguments[0], "http://test.url/page.md");
    });

    it("returns the content of the loaded page", async () => {
      mockUrl("http://test.url");
      mockFetch({ url: "http://test.url/index.md", content: "Test content" });

      const [_, content] = await loadPage("");

      assert.strictEqual(content, "Test content");
    });

    it("throws a not found error if page cannot be found", async () => {
      mockFetch({ status: 404 });

      const [error, _] = await loadPage("");

      assert.ok(error instanceof NotFoundError);
    });

    it("throws a server error if server responds with internal error", async () => {
      mockFetch({ status: 500 });

      const [error, _] = await loadPage("");

      assert.ok(error instanceof ServerError);
    });

    it("throws a network error if server is unreachable", async () => {
      mockFetch({ fails: true });

      const [error, _] = await loadPage("");

      assert.ok(error instanceof NetworkError);
    });
  });

  describe("navigate()", () => {
    beforeEach(() => {
      const mainElement = document.createElement("main");
      document.body.append(mainElement);
    });

    it("loads the page content to the `main` tag", async () => {
      mockUrl("http://test.url");
      mockFetch({ url: "http://test.url/index.md", content: "Test content" });

      await navigate();

      const mainElement = document.querySelector("main");
      assert.strictEqual(mainElement.innerHTML, "Test content");
    });

    it("loads the requested page content based on hashbang fragment", async () => {
      mockUrl("http://test.url/#!/page");
      mockFetch({ url: "http://test.url/page.md", content: "Test content" });

      await navigate();

      const mainElement = document.querySelector("main");
      assert.strictEqual(mainElement.innerHTML, "Test content");
    });

    it("loads the default page content if there is no hashbang fragment", async () => {
      mockUrl("http://test.url/#/page");
      mockFetch({ url: "http://test.url/index.md", content: "Test content" });

      await navigate();

      const mainElement = document.querySelector("main");
      assert.strictEqual(mainElement.innerHTML, "Test content");
    });

    it("loads the default page content if the fragment does not start with a hashbang", async () => {
      mockUrl("http://test.url/#page#!/page");
      mockFetch({ url: "http://test.url/index.md", content: "Test content" });

      await navigate();

      const mainElement = document.querySelector("main");
      assert.strictEqual(mainElement.innerHTML, "Test content");
    });

    it("ignores fragments in page name", async () => {
      mockFetch({ url: "http://test.url/page.md", content: "Test content" });
      window.location.assign("http://test.url/#!/page#fragment");

      await navigate();

      const mainElement = document.querySelector("main");
      assert.strictEqual(mainElement.innerHTML, "Test content");
    });
  });
});
