'use strict'
const os = require('os')
const fs = require('fs')
const path = require('path')
const cpFile = require('cp-file')
const makeDir = require('make-dir')
const pathExists = require('path-exists')

module.exports = (input, opts) => {
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof input}`)
  }

  opts = opts || { overwrite: false }

  const configPath = opts.dirPath || path.join(os.homedir(), '.touch-alt')

  if (!pathExists.sync(configPath)) {
    makeDir.sync(configPath)
  }

  const target = path.join(configPath, input)

  if (opts.add) {
    cpFile.sync(input, target)
    return
  }

  if (pathExists.sync(target)) {
    cpFile.sync(target, input, opts.overwrite)
  } else {
    fs.writeFileSync(target, '')
  }
}
