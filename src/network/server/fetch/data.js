import { fetchResource } from "./resource";
import { cache } from "../cache";
import { parseYaml } from "../parsers/yaml";
import { parseJson } from "../parsers/json";

const dataParsers = {
  yaml: parseYaml,
  yml: parseYaml,
  json: parseJson
};

export async function fetchData(name, type = "yaml") {
  if (cache.contains("data", name)) {
    return cache.get("data", name);
  }

  const data = await fetchResource("data", name, type, {});

  if (dataParsers[type] === undefined) {
    throw new Error(`Invalid data file type ${type}`);
  }

  return cache.set("data", name, await dataParsers[type](data));
}
