import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";

import { Resource } from "../resources/resource.js";
import { sanitizeContent } from "./sanitize.js";

describe("sanitize", () => {
  const { window } = new JSDOM("");
  const context = { sanitizer: createDOMPurify(window).sanitize };

  it("sanitizeContent() strips <script> tags from a Resource's content", async () => {
    const input = new Resource({ content: "<script>alert(1)</script>" });

    const result = await sanitizeContent(input, context);

    assert.equal(result.content, "");
    assert.equal(result.data, input.data);
  });

  it("sanitizeContent() strips inline event handler attributes", async () => {
    const input = new Resource({ content: '<p onclick="alert(1)">click</p>' });

    const result = await sanitizeContent(input, context);

    assert.equal(result.content, "<p>click</p>");
  });

  it("sanitizeContent() blocks javascript: URLs in href/src attributes", async () => {
    const input = new Resource({ content: '<a href="javascript:alert(1)">link</a>' });

    const result = await sanitizeContent(input, context);

    assert.equal(result.content, "<a>link</a>");
  });

  it("sanitizeContent() leaves safe HTML markup and the resource's data unchanged", async () => {
    const input = new Resource({
      data: "title: Doc",
      content: "<b>bold</b> and <i>italic</i>",
    });

    const result = await sanitizeContent(input, context);

    assert.equal(result.content, "<b>bold</b> and <i>italic</i>");
    assert.equal(result.data, input.data);
  });
});
