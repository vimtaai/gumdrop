import { mock } from "node:test";

export function mockFetch(options = {}) {
  const status = options.status ?? 200;
  const text = async () => options.content ?? "";
  const ok = status === 200;

  const response = { ok, status, text };
  mock.method(global.window, "fetch", () => Promise.resolve(response));
}
