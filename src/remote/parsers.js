import { parseJson } from "./parsers/json.js";
import { parseYaml } from "./parsers/yaml.js";
import { parseMarkdown } from "./parsers/markdown.js";

export const Parsers = {
  yaml: { type: "data", parse: parseYaml },
  yml: { type: "data", parse: parseYaml },
  json: { type: "data", parse: parseJson },
  md: { type: "document", parse: parseMarkdown }
};
