#!/usr/bin/env node
'use strict'
const meow = require('meow')
const updateNotifier = require('update-notifier')
const fn = require('.')

const cli = meow(
  `
  Usage
  $ touch-alt <source>
  $ touch-alt --add <source>

  Options
  -a, --add         Create new template file
  -o, --overwrite   Overwrite by template
  -l, --list        show template file list

  Example
  $ touch-alt .editorconfig
`,
  {
    flags: {
      add: {
        alias: 'a',
        type: 'boolean',
        default: false
      },
      overwrite: {
        alias: 'o',
        type: 'boolean',
        default: false
      },
      list: {
        alias: 'l',
        type: 'boolean',
        default: false
      }
    }
  }
)

updateNotifier({ pkg: cli.pkg }).notify()

try {
  const output = fn(cli.input[0], cli.flags)
  if (output) {
    console.log(output)
  }
} catch (err) {
  if (err.name === 'CpyError') {
    console.log(err.message)
    process.exit(1)
  } else {
    throw err
  }
}
