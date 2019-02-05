// import { jsyaml } from "js-yaml";

export function parseYaml(source) {
  return jsyaml.safeLoad(source);
}
