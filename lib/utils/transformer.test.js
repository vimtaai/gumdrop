import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { Transformer } from "./transformer.js";

describe("Transformer", () => {
  it("use() returns a chainable Transformer", () => {
    const transformer = new Transformer().use(async (r) => r).use(async (r) => r);

    assert.ok(transformer instanceof Transformer);
  });

  it("transform() threads a resource through registered transformations in order", async () => {
    const transformer = new Transformer()
      .use(async (r) => ({ ...r, value: `${r.value}-a` }))
      .use(async (r) => ({ ...r, value: `${r.value}-b` }));

    const result = await transformer.transform({ value: "start" });

    assert.deepEqual(result, { value: "start-a-b" });
  });

  it("transform() awaits each transformation before passing its result to the next", async () => {
    const transformer = new Transformer()
      .use(
        (r) =>
          new Promise((resolve) => setTimeout(() => resolve({ ...r, value: `${r.value}-a` }), 5)),
      )
      .use(async (r) => ({ ...r, value: `${r.value}-b` }));

    const result = await transformer.transform({ value: "start" });

    assert.deepEqual(result, { value: "start-a-b" });
  });

  it("transform() returns the resource unchanged when no transformations are registered", async () => {
    const transformer = new Transformer();

    const result = await transformer.transform({ value: "start" });

    assert.deepEqual(result, { value: "start" });
  });

  it("transform() propagates a rejection from a transformation", async () => {
    const transformer = new Transformer().use(async () => {
      throw new Error("failed");
    });

    await assert.rejects(() => transformer.transform({ value: "start" }));
  });

  it("transform() still works when detached from its instance", async () => {
    const transformer = new Transformer().use(async (r) => ({ ...r, value: `${r.value}-a` }));
    const { transform } = transformer;

    const result = await transform({ value: "start" });

    assert.deepEqual(result, { value: "start-a" });
  });

  it("transform.try() resolves a failure to an [error, null] tuple", async () => {
    const transformer = new Transformer().use(async () => {
      throw new Error("failed");
    });

    const [error, result] = await transformer.transform.try({ value: "start" });

    assert.ok(error);
    assert.equal(result, null);
  });

  it("transform() passes the context set via setContext() to each transformation", async () => {
    const transformer = new Transformer()
      .use(async (r, context) => ({ ...r, seen: context }))
      .setContext({ loader: "the-loader" });

    const result = await transformer.transform({ value: "start" });

    assert.deepEqual(result.seen, { loader: "the-loader" });
  });

  it("transform() passes an empty object as context when none was set", async () => {
    const transformer = new Transformer().use(async (r, context) => ({ ...r, seen: context }));

    const result = await transformer.transform({ value: "start" });

    assert.deepEqual(result.seen, {});
  });

  it("setContext() does not affect the transformer it was called on", async () => {
    const base = new Transformer().use(async (r, context) => ({ ...r, seen: context }));
    base.setContext({ loader: "the-loader" });

    const result = await base.transform({ value: "start" });

    assert.deepEqual(result.seen, {});
  });
});
