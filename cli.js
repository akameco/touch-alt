#!/usr/bin/env node
'use strict'
const meow = require('meow')
const updateNotifier = require('update-notifier')
const fn = require('./')

const cli = meow(
  `
  Usage
  $ touch-alt <source>
  $ touch-alt --add <source>

  Options
  -a, --add         Create new template file
  -o, --overwrite   Overwrite by template

  Example
  $ touch-alt .editorconfig
`,
  {
    alias: {
      a: 'add',
      o: 'overwrite'
    },
    boolean: ['add', 'overwrite'],
    default: {
      overwrite: false,
      add: false
    }
  }
)

updateNotifier({ pkg: cli.pkg }).notify()

const input = cli.input[0]

if (!input) {
  process.exit(0)
}

try {
  fn(input, cli.flags)
} catch (err) {
  if (err.name === 'CpyError') {
    console.log(err.message)
    process.exit(1)
  } else {
    throw err
  }
}
