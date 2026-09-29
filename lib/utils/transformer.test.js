import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Transformer } from "./transformer.js";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("transformer", () => {
  describe("Transformer", () => {
    describe("use()", () => {
      it("returns a chainable Transformer", () => {
        const transformer = new Transformer().use(async (r) => r).use(async (r) => r);

        assert.ok(transformer instanceof Transformer);
      });
    });

    describe("transform()", () => {
      it("threads a resource through registered transformations in order", async () => {
        const transformer = new Transformer()
          .use(async (r) => ({ ...r, value: `${r.value}-a` }))
          .use(async (r) => ({ ...r, value: `${r.value}-b` }));

        const result = await transformer.transform({ value: "start" });

        assert.deepEqual(result, { value: "start-a-b" });
      });

      it("awaits each transformation before passing its result to the next", async () => {
        const transformWithDelay = async (r) => {
          await delay(5);
          return { ...r, value: `${r.value}-a` };
        };

        const transformer = new Transformer()
          .use(transformWithDelay)
          .use(async (r) => ({ ...r, value: `${r.value}-b` }));

        const result = await transformer.transform({ value: "start" });

        assert.deepEqual(result, { value: "start-a-b" });
      });

      it("returns the resource unchanged when no transformations are registered", async () => {
        const transformer = new Transformer();

        const result = await transformer.transform({ value: "start" });

        assert.deepEqual(result, { value: "start" });
      });

      it("propagates a rejection from a transformation", async () => {
        const transformer = new Transformer().use(async () => {
          throw new Error("failed");
        });

        await assert.rejects(() => transformer.transform({ value: "start" }));
      });

      it("still works when detached from its instance", async () => {
        const transformer = new Transformer().use(async (r) => ({ ...r, value: `${r.value}-a` }));
        const { transform } = transformer;

        const result = await transform({ value: "start" });

        assert.deepEqual(result, { value: "start-a" });
      });

      it("resolves a failure to an [error, null] tuple via .try()", async () => {
        const transformer = new Transformer().use(async () => {
          throw new Error("failed");
        });

        const [error, result] = await transformer.transform.try({ value: "start" });

        assert.ok(error);
        assert.equal(result, null);
      });

      it("passes the context set via setContext() to each transformation", async () => {
        const transformer = new Transformer()
          .use(async (r, context) => ({ ...r, seen: context }))
          .setContext({ loader: "the-loader" });

        const result = await transformer.transform({ value: "start" });

        assert.deepEqual(result.seen, { loader: "the-loader" });
      });

      it("passes an empty object as context when none was set", async () => {
        const transformer = new Transformer().use(async (r, context) => ({ ...r, seen: context }));

        const result = await transformer.transform({ value: "start" });

        assert.deepEqual(result.seen, {});
      });
    });

    describe("setContext()", () => {
      it("does not affect the transformer it was called on", async () => {
        const base = new Transformer().use(async (r, context) => ({ ...r, seen: context }));
        base.setContext({ loader: "the-loader" });

        const result = await base.transform({ value: "start" });

        assert.deepEqual(result.seen, {});
      });
    });
  });
});
