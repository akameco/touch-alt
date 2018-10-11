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
      }
    }
  }
)

updateNotifier({ pkg: cli.pkg }).notify()

const [input] = cli.input

if (!input) {
  process.exit(0)
}

try {
  fn(input, cli.flags)
} catch (error) {
  console.log(error.message)
  process.exit(1)
}
