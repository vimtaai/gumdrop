import { imports } from "../../remote/imports";

export async function parseMarkdown(source) {
  const ExtraMark = await imports["extramark"];
  return ExtraMark.render(source);
}
