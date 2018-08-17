#!/usr/bin/env node

const path = require('path')
const program = require('commander')

const { defaultSourcePath, defaultOutputPath } = require('./constants')
const { mkdir, write } = require('./helpers')

const sourcePath = path.resolve(defaultSourcePath)
const outputPath = path.resolve(defaultOutputPath)

program
  .option('-d --dev', 'genereate uncompressed, development stylesheets')
  .parse(process.argv)

const rollup = require('rollup') // Build tool
const terser = require('terser') // Minifying tool

async function build (program) {
  console.log(`Building Gumdrop...\n`)

  // Command line options
  const options = {
    dev: program.dev || false
  }

  // Info output
  console.log(`Dev Mode:\t ${options.dev}\n`)

  // Building
  mkdir(outputPath)

  const outputFileName = `gumdrop${options.dev ? `` : `.min`}.js`
  const outputFilePath = path.join(outputPath, outputFileName)
  console.log(`[CREATE] ${outputFilePath}`)

  const bundle = await rollup.rollup({
    input: path.join(sourcePath, 'index.js')
  })
  const result = await bundle.generate({
    file: outputFileName,
    dir: outputPath,
    format: 'iife',
    sourcemap: true
  })

  if (options.dev) {
    await write(outputFilePath, result.code)
    console.log(`[CREATE] ${outputFilePath}.map`)
    await write(outputFilePath + '.map', result.map)
  } else {
    const minified = terser.minify(result.code)
    await write(outputFilePath, minified.code)
  }
}

build(program)
