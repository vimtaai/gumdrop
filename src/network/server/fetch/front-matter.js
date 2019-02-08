import { fetchData } from "./data";
import { FileData } from "../parsers/yaml";

export async function fetchFrontMatterData(context) {
  for (const field of Object.keys(context)) {
    if (context[field] instanceof FileData) {
      context[field] = await fetchData(context[field].file, context[field].extension);
    }
  }

  return context;
}
