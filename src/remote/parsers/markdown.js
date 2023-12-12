import { Imports } from "../../storage/imports.js";

export async function parseMarkdown(rawData) {
  const ExtraMark = await Imports.get("extramark");

  return ExtraMark.render(rawData);
}
