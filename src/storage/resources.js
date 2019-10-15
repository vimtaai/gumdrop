import { fetchResource, fetchErrorPage } from "remote/fetch";

export const Resources = {
  _resources: {},
  async get(resourcePath) {
    const url = resourcePath.url;

    if (url in this._resources) {
      return this._resources[url];
    }

    try {
      // eslint-disable-next-line
      this._resources[url] = await fetchResource(resourcePath);
    } catch (error) {
      // eslint-disable-next-line
      this._resources[url] = await fetchErrorPage(error);
    }

    return this._resources[url];
  }
};
