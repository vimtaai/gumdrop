import { dependencies } from "../../dependencies";
import { cdn } from "./cdn";

const proxy = {
  async get(imports, name) {
    if (imports.hasOwnProperty(name)) {
      return imports[name];
    }

    if (!dependencies.hasOwnProperty(name)) {
      throw new Error(`Unknown dependency ${name}.`);
    }

    const dependency = dependencies[name];
    const url = `${name}@${dependency.version}/${dependency.path}`;

    imports[name] = await cdn.import(url, dependency.export);
    return imports[name];
  }
};

export const imports = new Proxy({}, proxy);
