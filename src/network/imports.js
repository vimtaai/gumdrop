import { dependencies } from "../dependencies";

const cdn = {
  url: "https://cdn.jsdelivr.net/npm/",
  eval: window.eval.bind(window),
  import: async function(module, name = undefined) {
    window.module = imports;
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
};

const proxy = {
  async get(imports, name) {
    if (imports.hasOwnProperty(name)) {
      return imports[name];
    }

    if (!dependencies.hasOwnProperty(name)) {
      throw new Error(`Unknown dependency ${name}.`);
    }

    const dependency = dependencies[name];
    const url = `${dependency.name}@${dependency.version}/${dependency.path}`;

    imports[name] = await cdn.import(url, dependency.export);
    return imports[name];
  }
};

export const imports = new Proxy({}, proxy);
