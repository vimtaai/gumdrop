import { fetchData } from "../network/fetch";
import { imports } from "../network/imports";

export async function parseYaml(source) {
  const JSYaml = await imports.jsyaml;

  const FileYamlType = new JSYaml.Type("!file", {
    kind: "scalar",
    resolve(data) {
      return data !== null;
    },
    construct(data) {
      return fetchData(data, "yaml");
    }
  });

  const YamlWithFilesSchema = JSYaml.Schema.create([FileYamlType]);

  return JSYaml.safeLoad(source, { schema: YamlWithFilesSchema });
}
