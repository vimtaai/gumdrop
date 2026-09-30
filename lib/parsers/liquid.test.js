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

    it("renders an if block only when its condition holds", async () => {
      const input = "{% if shown %}yes{% endif %}{% if hidden %}no{% endif %}";
      const data = { shown: true, hidden: false };
      const expectedOutput = "yes";

      const result = await renderLiquid(input, data);

      assert.equal(result, expectedOutput);
    });

    it("repeats a for block for each item of a sequence", async () => {
      const input = "{% for author in authors %}{{ author.name }};{% endfor %}";
      const data = { authors: [{ name: "Jane" }, { name: "John" }] };
      const expectedOutput = "Jane;John;";

      const result = await renderLiquid(input, data);

      assert.equal(result, expectedOutput);
    });

    it("keeps the newline after a tag", async () => {
      const input = "{% for author in authors %}\n- {{ author.name }}\n{% endfor %}";
      const data = { authors: [{ name: "Jane" }, { name: "John" }] };
      const expectedOutput = "\n- Jane\n\n- John\n";

      const result = await renderLiquid(input, data);

      assert.equal(result, expectedOutput);
    });

    it("trims the whitespace after a tag closed with -%}", async () => {
      const input = "{% for author in authors -%}\n- {{ author.name }}\n{% endfor %}";
      const data = { authors: [{ name: "Jane" }, { name: "John" }] };
      const expectedOutput = "- Jane\n- John\n";

      const result = await renderLiquid(input, data);

      assert.equal(result, expectedOutput);
    });

    it("rejects the include tag instead of reading the filesystem", async () => {
      const input = '{% include "package.json" %}';
      const data = {};

      await assert.rejects(() => renderLiquid(input, data), /"include" tag is not supported/);
    });

    it("rejects the render tag instead of reading the filesystem", async () => {
      const input = '{% render "package.json" %}';
      const data = {};

      await assert.rejects(() => renderLiquid(input, data), /"render" tag is not supported/);
    });

    it("rejects the layout tag instead of reading the filesystem", async () => {
      const input = '{% layout "package.json" %}';
      const data = {};

      await assert.rejects(() => renderLiquid(input, data), /"layout" tag is not supported/);
    });

    it("rejects an unsupported tag even in a branch that is never rendered", async () => {
      const input = '{% if false %}{% include "package.json" %}{% endif %}';
      const data = {};

      await assert.rejects(() => renderLiquid(input, data), /"include" tag is not supported/);
    });

    it("rejects a malformed template", async () => {
      const input = "{{ title";
      const data = { title: "My Document" };

      await assert.rejects(() => renderLiquid(input, data));
    });
  });
});
