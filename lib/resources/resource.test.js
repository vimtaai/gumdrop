import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Resource } from "./resource.js";

describe("resource", () => {
  it("new Resource() defaults data and content to empty strings", () => {
    const result = new Resource();

    assert.equal(result.data, "");
    assert.equal(result.content, "");
  });

  it("new Resource() sets data and content from the given options", () => {
    const input = { data: { title: "My Document" }, content: "# Heading\n" };

    const result = new Resource(input);

    assert.equal(result.data, input.data);
    assert.equal(result.content, input.content);
  });

  it("new Resource() defaults content when only data is given", () => {
    const input = { data: { title: "My Document" } };

    const result = new Resource(input);

    assert.equal(result.data, input.data);
    assert.equal(result.content, "");
  });
});
