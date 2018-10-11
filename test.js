import fs from 'fs'
import path from 'path'
import test from 'ava'
import del from 'del'
import uuid from 'uuid'
import fn from '.'

test.before(() => {
  process.chdir(__dirname)
})

test.beforeEach(t => {
  t.context.targetPath = path.resolve(uuid.v4())
  t.context.targetFilePath = path.resolve(t.context.targetPath, 'target')
  t.context.output = 'target'
  t.context.src = uuid.v4()
  t.context.dest = uuid.v4()
})

test.afterEach.always(t => {
  Object.keys(t.context).forEach(p => del.sync(t.context[p]))
})

test('run', t => {
  const { targetPath, targetFilePath, output } = t.context
  fs.mkdirSync(targetPath)
  fs.writeFileSync(targetFilePath, 'unicorn', 'utf8')
  fn(output, { dirPath: targetPath })
  t.is(fs.readFileSync(output, 'utf8'), 'unicorn')
})

test('from not found', t => {
  const { src } = t.context
  fn(src)
  t.is(fs.readFileSync(src, 'utf8'), '')
})

test('--add', t => {
  const { src, dest } = t.context
  fs.writeFileSync(src, '')
  fn(src, { add: true, dirPath: dest })
  t.is(
    fs.readFileSync(path.resolve(dest, path.basename(src)), 'utf8'),
    fs.readFileSync(src, 'utf8')
  )
})

test('--overwrite=true', t => {
  const { targetPath, targetFilePath, output } = t.context
  fs.mkdirSync(targetPath)
  fs.writeFileSync(targetFilePath, 'overwrite', 'utf-8')
  fs.writeFileSync(output, 'unicorn')
  fn(output, { dirPath: targetPath, overwrite: true })
  t.is(fs.readFileSync(output, 'utf-8'), 'overwrite')
})

test('--overwrite=false', t => {
  const { targetPath, targetFilePath, output } = t.context
  fs.mkdirSync(targetPath)
  fs.writeFileSync(targetFilePath, 'overwrite', 'utf-8')
  fs.writeFileSync(output, 'unicorn')
  fn(output, { dirPath: targetPath, overwrite: false })
  t.is(fs.readFileSync(output, 'utf-8'), 'unicorn')
})

test('throw err', t => {
  const err = t.throws(() => fn(23), TypeError)
  t.is(err.message, 'Expected a string, got number')
})
