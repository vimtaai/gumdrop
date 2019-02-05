import { parseMarkdown } from "./parsers/markdown";
import { parseJson } from "./parsers/json";
import { parseYaml } from "./parsers/yaml";

export const parsers = {
  yaml: parseYaml,
  json: parseJson,
  md: parseMarkdown
};
