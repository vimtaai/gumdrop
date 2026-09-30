import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { renderLiquid } from "./liquid.js";

describe("liquid", () => {
  describe("renderLiquid()", () => {
    it("substitutes a variable from data", async () => {
      const input = "# {{ title }}";
      const data = { title: "My Document" };
      const expectedOutput = "# My Document";

      const result = await renderLiquid(input, data);

      assert.equal(result, expectedOutput);
    });

    it("renders a missing variable as an empty string", async () => {
      const input = "Hello {{ name }}!";
      const data = {};
      const expectedOutput = "Hello !";

      const result = await renderLiquid(input, data);

      assert.equal(result, expectedOutput);
    });

    it("outputs a value raw, without escaping", async () => {
      const input = "{{ note }}";
      const data = { note: "<b>bold</b> & more" };
      const expectedOutput = "<b>bold</b> & more";

      const result = await renderLiquid(input, data);

      assert.equal(result, expectedOutput);
    });

    it("rejects a malformed template", async () => {
      const input = "{{ title";
      const data = { title: "My Document" };

      await assert.rejects(() => renderLiquid(input, data));
    });
  });
});
