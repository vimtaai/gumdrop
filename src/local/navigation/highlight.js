import { Imports } from "storage/imports";

export async function highlightCodeBlocks() {
  if (!document.querySelector("pre > code")) {
    return;
  }

  const Prism = await Imports.prismjs;
  Prism.highlightAll();
}
