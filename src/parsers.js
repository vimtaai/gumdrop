import { parseMarkdown } from "./parsers/markdown";
import { parseJson } from "./parsers/json";

export const parsers = {
  md: parseMarkdown,
  json: parseJson
};
