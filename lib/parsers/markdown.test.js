import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { renderMarkdown } from "./markdown.js";

describe("markdown", () => {
  it("renderMarkdown() renders Markdown content to HTML via extramark", () => {
    const input = "# Heading";
    const expectedOutput = '<h1 id="heading" tabindex="-1">Heading</h1>\n';

    const result = renderMarkdown(input);

    assert.equal(result, expectedOutput);
  });

  it("renderMarkdown() throws when given non-string content", () => {
    const input = undefined;

    assert.throws(() => renderMarkdown(input));
  });
});
