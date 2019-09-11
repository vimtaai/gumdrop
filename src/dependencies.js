import { dependencies as dependencyVersions } from "../package.json";

export const dependencies = {
  ["extramark"]: {
    version: dependencyVersions["extramark"],
    path: "dist/extramark.min.js",
    export: "ExtraMark"
  },
  ["js-yaml"]: {
    version: dependencyVersions["js-yaml"],
    path: "dist/js-yaml.min.js",
    export: "jsyaml"
  },
  ["mustache"]: {
    version: dependencyVersions["mustache"],
    path: "mustache.min.js",
    export: "Mustache"
  }
};
