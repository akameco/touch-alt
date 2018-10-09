'use strict'
const os = require('os')
const fs = require('fs')
const path = require('path')
const cpFile = require('cp-file')
const makeDir = require('make-dir')
const pathExists = require('path-exists')

module.exports = (input, opts) => {
  opts = Object.assign({ add: false, overwrite: false, list: false }, opts)

  const configPath = opts.dirPath || path.join(os.homedir(), '.touch-alt')

  if (input === undefined) {
    if (opts.list) {
      if (!pathExists.sync(configPath)) {
        return 'no template files'
      }
      const files = fs.readdirSync(configPath)
      if (files.length === 0) {
        return 'no template files'
      }
      return files.join('\n')
    }
    return
  }
  if (typeof input !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof input}`)
  }

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
  } else {
    fs.writeFileSync(input, '')
  }
}
