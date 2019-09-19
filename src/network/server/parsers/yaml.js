import { imports } from "network/remote/imports";

import { fetchResource } from "network/server/fetch";
import { PathData } from "../path";

export async function parseYaml(yaml) {
  const JSYaml = await imports["js-yaml"];

  const FileYamlType = new JSYaml.Type("!file", {
    kind: "scalar",
    resolve(data) {
      return data !== null;
    },
    construct(data) {
      return new PathData(data, "yaml");
    }
  });

  const YamlWithFilesSchema = JSYaml.Schema.create([FileYamlType]);

  const yamlData = JSYaml.safeLoad(yaml, { schema: YamlWithFilesSchema });

  for (const field of Object.keys(yamlData)) {
    if (yamlData[field] instanceof PathData) {
      const { path } = yamlData[field];

      const resourcePath = `${path[0] === "/" ? path.substr(1) : `data/${path}`}`;
      yamlData[field] = await fetchResource(resourcePath);
    }
  }

  return yamlData;
}
