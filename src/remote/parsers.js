import { parseJson } from "./parsers/json";
import { parseYaml } from "./parsers/yaml";
import { parseMarkdown } from "./parsers/markdown";

export const Parsers = {
  yaml: { type: "data", parse: parseYaml },
  yml: { type: "data", parse: parseYaml },
  json: { type: "data", parse: parseJson },
  md: { type: "document", parse: parseMarkdown }
};
