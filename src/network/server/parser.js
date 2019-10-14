import { parseJson } from "network/server/parsers/json";
import { parseYaml } from "network/server/parsers/yaml";
import { parseMarkdown } from "network/server/parsers/markdown";

export const ResourceTypes = {
  yaml: { type: "data", parse: parseYaml },
  yml: { type: "data", parse: parseYaml },
  json: { type: "data", parse: parseJson },
  md: { type: "document", parse: parseMarkdown }
};
