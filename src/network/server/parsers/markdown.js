import { imports } from "network/remote/imports";

export async function parseMarkdown(source) {
  const ExtraMark = await imports.extramark;

  return ExtraMark.render(source);
}
