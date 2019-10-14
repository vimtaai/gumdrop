import { imports } from "storage/imports";

export async function parseMarkdown(rawData) {
  const ExtraMark = await imports.extramark;
  return ExtraMark.render(rawData);
}
