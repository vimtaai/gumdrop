import { mock } from "node:test";

export function mockFetch(options = {}) {
  const { content, error, message, status, url } = options;

  const fetchMock = async (resource) => {
    if (error) {
      throw error;
    }

    return url === resource
      ? { ok: true, status: 200, message, text: async () => content }
      : { ok: false, status, message };
  };

  return mock.method(window, "fetch", fetchMock).mock;
}

export function mockLocation(options = {}) {
  const { url } = options;

  const locationMock = () => {
    return new URL(url);
  };

  return mock.getter(window, "location", locationMock).mock;
}
