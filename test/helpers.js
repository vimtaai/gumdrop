import { mock } from "node:test";

export function mockFetch(options = {}) {
  const status = options.status ?? 200;
  const text = async () => options.content ?? "";
  const ok = status === 200;
  const url = options.url;
  const fails = options.fails;

  const fetchMock = (resource) => {
    if (fails) {
      return Promise.reject();
    }

    if (!url || url === resource) {
      return Promise.resolve({ ok, status, text });
    }

    return Promise.resolve({ ok: false, status: 404 });
  };

  mock.method(window, "fetch", fetchMock);
}

export function mockUrl(url) {
  window.location.assign(url);
}
