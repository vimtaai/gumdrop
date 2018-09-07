#!/usr/bin/env node

const program = require('commander')

// Script description

program
  .description('CLI for building Gumdrop')
  .usage('<command> [options]')
  .command('build', 'Build Gumdrop').alias('b')
  .parse(process.argv)
