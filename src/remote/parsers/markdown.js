import { Imports } from "storage/imports";

export async function parseMarkdown(rawData) {
  const ExtraMark = await Imports.extramark;
  return ExtraMark.render(rawData);
}
