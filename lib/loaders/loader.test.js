import { strict as assert } from "node:assert";
import { describe, it, mock } from "node:test";

import { Loader } from "./loader.js";

class TestLoader extends Loader {
  constructor(loadFile) {
    super();
    this.loadFile = loadFile;
  }
}

describe("Loader", () => {
  it("load() rejects when the subclass does not implement loadFile()", async () => {
    const input = "data/jane.yaml";

    class BareLoader extends Loader {}

    await assert.rejects(() => new BareLoader().load(input), /BareLoader must implement loadFile/);
  });

  it("load() returns the content produced by loadFile()", async () => {
    const input = "data/jane.yaml";
    const expectedOutput = "name: Jane Doe\n";
    const loader = new TestLoader(mock.fn(async () => expectedOutput));

    const result = await loader.load(input);

    assert.equal(result, expectedOutput);
  });

  it("load() calls loadFile() once for a path requested twice", async () => {
    const input = "data/jane.yaml";
    const expectedOutput = "name: Jane Doe\n";
    const loadFile = mock.fn(async () => expectedOutput);
    const loader = new TestLoader(loadFile);

    const results = [await loader.load(input), await loader.load(input)];

    assert.deepEqual(results, [expectedOutput, expectedOutput]);
    assert.equal(loadFile.mock.callCount(), 1);
  });

  it("load() shares one in-flight load between concurrent calls for the same path", async () => {
    const input = "data/jane.yaml";
    const expectedOutput = "name: Jane Doe\n";
    let completeLoad;
    const loadFile = mock.fn(() => new Promise((resolve) => (completeLoad = resolve)));
    const loader = new TestLoader(loadFile);

    const loads = Promise.all([loader.load(input), loader.load(input)]);
    completeLoad(expectedOutput);

    assert.deepEqual(await loads, [expectedOutput, expectedOutput]);
    assert.equal(loadFile.mock.callCount(), 1);
  });

  it("load() does not retry a path whose load rejected", async () => {
    const input = "data/missing.yaml";
    const loadFile = mock.fn(async () => {
      throw new Error("not found");
    });
    const loader = new TestLoader(loadFile);

    await assert.rejects(() => loader.load(input), /not found/);
    await assert.rejects(() => loader.load(input), /not found/);

    assert.equal(loadFile.mock.callCount(), 1);
  });

  it("load() does not share cached loads between instances", async () => {
    const input = "data/jane.yaml";
    const loadFile = mock.fn(async () => "name: Jane Doe\n");

    await new TestLoader(loadFile).load(input);
    await new TestLoader(loadFile).load(input);

    assert.equal(loadFile.mock.callCount(), 2);
  });
});
