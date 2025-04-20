import { strict as assert } from "node:assert";
import { beforeEach, describe, it } from "node:test";

import { mockFetch, mockLocation } from "../test/helpers.js";
import { navigate } from "./navigation.js";

describe("navigate()", () => {
  beforeEach(() => {
    const mainElement = document.createElement("main");
    document.body.append(mainElement);
  });

  it("loads the page content to the `main` tag", async () => {
    mockLocation({ url: "http://test.url" });
    mockFetch({ url: "http://test.url/index.md", content: "<p>Test</p>" });

    await navigate();

    const mainElement = document.querySelector("main");
    assert.strictEqual(mainElement.innerHTML.trim(), "<p>Test</p>");
  });

  it("loads the requested page content based on hashbang fragment", async () => {
    mockLocation({ url: "http://test.url/#!/page" });
    mockFetch({ url: "http://test.url/page.md", content: "<p>Test</p>" });

    await navigate();

    const mainElement = document.querySelector("main");
    assert.strictEqual(mainElement.innerHTML.trim(), "<p>Test</p>");
  });

  it("handles if the page is not on the root of the domain", async () => {
    mockLocation({ url: "http://test.url/dir/#!/page" });
    mockFetch({ url: "http://test.url/dir/page.md", content: "<p>Test</p>" });

    await navigate();

    const mainElement = document.querySelector("main");
    assert.strictEqual(mainElement.innerHTML.trim(), "<p>Test</p>");
  });

  it("parses markdown content", async () => {
    mockLocation({ url: "http://test.url/#!/page" });
    mockFetch({ url: "http://test.url/page.md", content: "# Test" });

    await navigate();

    const mainElement = document.querySelector("main");
    assert.strictEqual(mainElement.innerHTML.trim(), "<h1>Test</h1>");
  });

  it("loads the default page content if there is no hashbang fragment", async () => {
    mockLocation({ url: "http://test.url/#/page" });
    mockFetch({ url: "http://test.url/index.md", content: "<p>Test</p>" });

    await navigate();

    const mainElement = document.querySelector("main");
    assert.strictEqual(mainElement.innerHTML.trim(), "<p>Test</p>");
  });

  it("loads the default page content if the fragment does not start with a hashbang", async () => {
    mockLocation({ url: "http://test.url/#page#!/page" });
    mockFetch({ url: "http://test.url/index.md", content: "<p>Test</p>" });

    await navigate();

    const mainElement = document.querySelector("main");
    assert.strictEqual(mainElement.innerHTML.trim(), "<p>Test</p>");
  });

  it("ignores fragments in page name", async () => {
    mockFetch({ url: "http://test.url/page.md", content: "<p>Test</p>" });
    window.location.assign("http://test.url/#!/page#fragment");

    await navigate();

    const mainElement = document.querySelector("main");
    assert.strictEqual(mainElement.innerHTML.trim(), "<p>Test</p>");
  });
});
