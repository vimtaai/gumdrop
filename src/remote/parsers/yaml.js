import { ResourcePath } from "utils/resource-path";
import { Imports } from "storage/imports";

export async function parseYaml(rawData) {
  const JSYaml = await Imports["js-yaml"];

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
