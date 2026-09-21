import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Resource } from "../resources/resource.js";
import { parseData } from "./parse.js";

describe("parse", () => {
  it("parseData() parses raw YAML text into an object", async () => {
    const input = new Resource({ data: "title: My Document\n" });

    const result = await parseData(input);

    assert.deepEqual(result, new Resource({ data: { title: "My Document" } }));
  });

  it("parseData() preserves content", async () => {
    const input = new Resource({ data: "title: My Document\n", content: "# Heading\n" });

    const result = await parseData(input);

    assert.equal(result.content, "# Heading\n");
  });

  it("parseData() preserves path", async () => {
    const input = new Resource({ data: "title: My Document\n", path: "data/author.yaml" });

    const result = await parseData(input);

    assert.equal(result.path, "data/author.yaml");
  });
});
