import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { JSDOM } from "jsdom";

import { createSanitizer } from "./sanitize.js";

describe("sanitize", () => {
  const { window } = new JSDOM("");
  const sanitize = createSanitizer(window);

  it("createSanitizer() strips <script> tags", () => {
    const input = "<script>alert(1)</script>";
    const expectedOutput = "";

    const result = sanitize(input);

    assert.equal(result, expectedOutput);
  });

  it("createSanitizer() strips inline event handler attributes", () => {
    const input = '<p onclick="alert(1)">click</p>';
    const expectedOutput = "<p>click</p>";

    const result = sanitize(input);

    assert.equal(result, expectedOutput);
  });

  it("createSanitizer() blocks javascript: URLs in href/src attributes", () => {
    const input = '<a href="javascript:alert(1)">link</a>';
    const expectedOutput = "<a>link</a>";

    const result = sanitize(input);

    assert.equal(result, expectedOutput);
  });

  it("createSanitizer() leaves safe HTML markup unchanged", () => {
    const input = "<b>bold</b> and <i>italic</i>";
    const expectedOutput = "<b>bold</b> and <i>italic</i>";

    const result = sanitize(input);

    assert.equal(result, expectedOutput);
  });
});
