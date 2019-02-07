import { imports } from "../network/imports";

export async function parseMarkdown(source) {
  const ExtraMark = await imports.extramark;
  return ExtraMark.render(source);
}
