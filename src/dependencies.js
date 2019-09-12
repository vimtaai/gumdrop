import { dependencies as dependencyVersions } from "../package.json";

export const dependencies = {
  extramark: {
    version: dependencyVersions.extramark,
    path: "dist/extramark.min.js",
    export: "ExtraMark"
  },
  mustache: {
    version: dependencyVersions.mustache,
    path: "mustache.min.js",
    export: "Mustache"
  },
  prismjs: {
    version: dependencyVersions.prismjs,
    path: "prism.min.js",
    export: "Prism"
  },
  "js-yaml": {
    version: dependencyVersions["js-yaml"],
    path: "dist/js-yaml.min.js",
    export: "jsyaml"
  }
};
