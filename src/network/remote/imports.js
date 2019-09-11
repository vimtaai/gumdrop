import { dependencies } from "dependencies";

import { cdn } from "network/remote/cdn";

const proxy = {
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

export const imports = new Proxy({}, proxy);
