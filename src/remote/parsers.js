import { parseJson } from "remote/parsers/json";
import { parseYaml } from "remote/parsers/yaml";
import { parseMarkdown } from "remote/parsers/markdown";

export const ResourceTypes = {
  yaml: { type: "data", parse: parseYaml },
  yml: { type: "data", parse: parseYaml },
  json: { type: "data", parse: parseJson },
  md: { type: "document", parse: parseMarkdown }
};
