import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { mockFetch } from "../test/helpers.js";
import { NotFoundError, ServerError } from "./errors.js";
import { loadPage } from "./index.js";

describe("Navigation", () => {
  describe("loadPage()", () => {
    it("loads `index` page by default", async () => {
      mockFetch();

      await loadPage("");

      const fetchCall = window.fetch.mock.calls[0];
      assert.strictEqual(fetchCall.arguments[0], "http://test.url/index.md");
    });

    it("loads given page if specified", async () => {
      mockFetch();

      await loadPage("page");

      const fetchCall = window.fetch.mock.calls[0];
      assert.strictEqual(fetchCall.arguments[0], "http://test.url/page.md");
    });

    it("returns the content of the loaded page", async () => {
      mockFetch({ status: 200, content: "Test content" });

      const content = await loadPage("");

      assert.strictEqual(content, "Test content");
    });

    it("throws a not found error if page cannot be found", async () => {
      mockFetch({ status: 404 });

      const callNavigate = async () => {
        await loadPage("");
      };

      await assert.rejects(callNavigate, NotFoundError);
    });

    it("throws a server error if server responds with internal error", async () => {
      mockFetch({ status: 500 });

      const callNavigate = async () => {
        await loadPage("");
      };

      await assert.rejects(callNavigate, ServerError);
    });
  });
});
