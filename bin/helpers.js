const fs = require('fs')
const util = require('util')
const mkdirp = require('mkdirp')

const mkdir = util.promisify(mkdirp)
const write = util.promisify(fs.writeFile)

module.exports = {
  mkdir,
  write
}
