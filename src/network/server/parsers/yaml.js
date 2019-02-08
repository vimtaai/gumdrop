import { imports } from "../../remote/imports";

export class FileData {
  constructor(file) {
    const dot = file.lastIndexOf(".");

    if (dot === -1) {
      this.file = file;
      this.extension = "yaml";
    } else {
      this.file = file.slice(0, dot);
      this.extension = file.slice(dot + 1);
    }
  }
}

export async function parseYaml(source) {
  const JSYaml = await imports.jsyaml;

  const FileYamlType = new JSYaml.Type("!file", {
    kind: "scalar",
    resolve(data) {
      return data !== null;
    },
    construct(data) {
      return new FileData(data);
    }
  });

  const YamlWithFilesSchema = JSYaml.Schema.create([FileYamlType]);

  return JSYaml.safeLoad(source, { schema: YamlWithFilesSchema });
}
