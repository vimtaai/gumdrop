import { dependencies as dependencyVersions } from "../package.json";

export const dependencies = {
  extramark: {
    name: "extramark",
    version: dependencyVersions.extramark,
    path: "dist/extramark.min.js",
    export: "ExtraMark"
  },
  mustache: {
    name: "mustache",
    version: dependencyVersions.mustache,
    path: "mustache.min.js",
    export: "Mustache"
  },
  prismjs: {
    name: "prismjs",
    version: dependencyVersions.prismjs,
    path: "prism.min.js",
    export: "Prism",
    async callback(dependency, Imports, Prism) {
      await Imports.get("prismjs-autoloader");

      Prism.plugins.autoloader.languages_path = `${Imports.cdnRoot}/${dependency.name}@${dependency.version}/components/`;
    }
  },
  "prismjs-autoloader": {
    name: "prismjs",
    version: dependencyVersions.prismjs,
    path: "plugins/autoloader/prism-autoloader.min.js",
    export: "null"
  },
  "js-yaml": {
    name: "prismjs",
    version: dependencyVersions["js-yaml"],
    path: "dist/js-yaml.min.js",
    export: "jsyaml"
  }
};
