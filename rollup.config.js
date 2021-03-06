const babel = require("rollup-plugin-babel");
const minify = require("rollup-plugin-babel-minify");
const include = require("rollup-plugin-includepaths");
const resolve = require("rollup-plugin-node-resolve");
const commonjs = require("rollup-plugin-commonjs");
const json = require("rollup-plugin-json");

const { name: outputFileName, module: input } = require("./package.json");

const isProductionBuild = process.env.BUILD === "production";
const output = {};
const plugins = [
  include({ paths: ["src"] }),
  babel(),
  resolve({ preferBuiltins: false }),
  commonjs(),
  json()
];

if (process.env.TARGET === "browser") {
  output.format = "iife";
  output.file = `dist/${outputFileName}${isProductionBuild ? ".min" : ""}.js`;
  output.name = "Gumdrop";
  output.sourcemap = !isProductionBuild;

  if (isProductionBuild) {
    plugins.push(minify());
  }
}

module.exports = { input, output, plugins };
