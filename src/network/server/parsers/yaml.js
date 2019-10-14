import { imports } from "storage/imports";

import { ResourcePath } from "utils/resource-path";

export async function parseYaml(rawData) {
  const JSYaml = await imports["js-yaml"];

  const FileYamlType = new JSYaml.Type("!file", {
    kind: "scalar",
    resolve(data) {
      return data !== null;
    },
    construct(data) {
      return new ResourcePath(data, "data", "yaml");
    }
  });

  const YamlWithFilesSchema = JSYaml.Schema.create([FileYamlType]);

  return JSYaml.safeLoad(rawData, { schema: YamlWithFilesSchema }) || {};
}
