import { build } from "esbuild";

await build({
  entryPoints: ["src/index.js", "src/modules/markdown.js"],
  bundle: true,
  outdir: "dist",
  outbase: "src",
  allowOverwrite: true,
  format: "esm",
});
