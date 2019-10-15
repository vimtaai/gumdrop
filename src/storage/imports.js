import { dependencies } from "dependencies";

export class CDN {
  constructor(url) {
    this.url = url;
    this.eval = window.eval.bind(window); // eslint-disable-line
  }

  async import(module, name = undefined) {
    window.module = {};
    const response = await window.fetch(this.url + module);

    if (!response.ok) {
      // eslint-disable-next-line
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

const cdn = new CDN("https://cdn.jsdelivr.net/npm/");

const importsProxy = {
  async get(imports, name) {
    if (name in imports) {
      return imports[name];
    }

    if (!(name in dependencies)) {
      throw new Error(`Unknown dependency ${name}.`);
    }

    const dependency = dependencies[name];
    const url = `${name}@${dependency.version}/${dependency.path}`;

    // eslint-disable-next-line
    imports[name] = await cdn.import(url, dependency.export);

    return imports[name];
  }
};

export const Imports = new Proxy({}, importsProxy);
