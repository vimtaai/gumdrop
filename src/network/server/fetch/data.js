import { cache } from "network/server/cache";
import { fetchResource } from "network/server/fetch/resource";
import { parseYaml } from "network/server/parsers/yaml";
import { parseJson } from "network/server/parsers/json";

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
