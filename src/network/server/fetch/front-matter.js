import { fetchData } from "network/server/fetch/data";
import { FileData } from "network/server/parsers/yaml";

export async function fetchFrontMatterData(context) {
  const contextWithFileData = {};

  for (const field of Object.keys(context)) {
    if (context[field] instanceof FileData) {
      contextWithFileData[field] = await fetchData(context[field].file, context[field].extension);
    } else {
      contextWithFileData[field] = context[field];
    }
  }

  return contextWithFileData;
}
