import { fetchResource } from "./resource";
import { cache } from "../../client/cache";
import { parsers } from "../../parsers";

export async function fetchData(name, type = "yaml") {
  if (cache.contains("data", name)) {
    return cache.get("data", name);
  }

  const data = await fetchResource("data", name, type, {});

  return cache.set("data", name, await parsers[type](data));
}
