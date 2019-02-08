export class CDN {
  constructor(url) {
    this.url = url;
    this.eval = window.eval.bind(window);
  }
  async import(module, name = undefined) {
    window.module = {};
    const response = await window.fetch(this.url + module);

    if (!response.ok) {
      console.error(`Could not load module ${module} from CDN ${this.url} (${response.status})`);
      return;
    }

    this.eval(`(function (module) {
      ${await response.text()}
      ${name !== undefined ? `module.exports = ${name};` : ``}
    })(window.module)`);

    return window.module.exports;
  }
}

export const cdn = new CDN("https://cdn.jsdelivr.net/npm/");
