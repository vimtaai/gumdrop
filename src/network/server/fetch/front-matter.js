import { fetchData } from "network/server/fetch/data";
import { FileData } from "network/server/parsers/yaml";

export async function fetchFrontMatterData(context) {
  for (const field of Object.keys(context)) {
    if (context[field] instanceof FileData) {
      context[field] = await fetchData(context[field].file, context[field].extension);
    }
  }

  return context;
}
