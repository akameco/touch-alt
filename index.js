// @flow
'use strict'
const os = require('os')
const fs = require('fs')
const path = require('path')
const cpFile = require('cp-file')
const makeDir = require('make-dir')
const pathExists = require('path-exists')

module.exports = (input /* : string */, opts /* : Object */) => {
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof input}`)
  }

  opts = Object.assign({ add: false, overwrite: false }, opts)

  const configPath = opts.dirPath || path.join(os.homedir(), '.touch-alt')

  if (!pathExists.sync(configPath)) {
    makeDir.sync(configPath)
  }

  const target = path.resolve(configPath, input)

  if (opts.add) {
    cpFile.sync(input, target)
    return
  }

  if (pathExists.sync(target)) {
    cpFile.sync(target, input, { overwrite: opts.overwrite })
  } else if (pathExists.sync(input)) {
    throw new Error(`already exist: ${input}`)
  } else {
    fs.writeFileSync(input, '')
  }
}
