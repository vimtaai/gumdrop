import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { mockFetch } from "../test/helpers.js";
import { fetchResource } from "./resource.js";

describe("fetchResource()", () => {
  it("fetches the resource from the specified path", async () => {
    const fetchMock = mockFetch({ url: "http://test.url/test.md" });

    await fetchResource("http://test.url", "test.md");

    const fetchCall = fetchMock.calls[0];
    assert.strictEqual(fetchCall.arguments[0], "http://test.url/test.md");
  });

  it("returns the content of the loaded resource", async () => {
    mockFetch({ url: "http://test.url/test.md", content: "Test content" });

    const content = await fetchResource("http://test.url", "test.md");

    assert.strictEqual(content, "Test content");
  });

  it("throws an error with the HTTP response code", async () => {
    mockFetch({ status: 404, message: "Not found" });

    const [error, _] = await fetchResource.try("http://test.url", "test.md");

    const errorType = error.constructor;
    assert.strictEqual(errorType, Error);
    assert.strictEqual(error.cause, 404);
    assert.strictEqual(error.message, "Not found");
  });

  it("propagates errors from HTTP fetch", async () => {
    mockFetch({ error: new TypeError("Failed to fetch") });

    const [error, _] = await fetchResource.try("http://test.url", "test.md");

    const errorType = error.constructor;
    assert.strictEqual(errorType, TypeError);
    assert.strictEqual(error.cause, undefined);
    assert.strictEqual(error.message, "Failed to fetch");
  });
});
