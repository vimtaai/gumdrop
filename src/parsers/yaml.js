import { fetchData } from "../network/fetch";

// import { jsyaml } from "js-yaml";

export function parseYaml(source) {
  const FileYamlType = new jsyaml.Type("!file", {
    kind: "scalar",
    resolve(data) {
      return data !== null;
    },
    construct(data) {
      return fetchData(data, "yaml");
    }
  });

  const YamlWithFilesSchema = jsyaml.Schema.create([FileYamlType]);

  return jsyaml.safeLoad(source, { schema: YamlWithFilesSchema });
}
