import fs from 'fs';
import path from 'path';
import test from 'ava';
import del from 'del';
import uuid from 'uuid';
import fn from '.';

test.before(() => {
  process.chdir(path.dirname(__dirname));
});

test.beforeEach(t => {
  t.context.src = uuid.v4();
  t.context.dest = uuid.v4();
  t.context.creates = [t.context.src, t.context.dest];
});

test.afterEach.always(t => {
  t.context.creates.forEach(path => del.sync(path));
});

test('run', t => {
  const { src, dest } = t.context;
  fs.mkdirSync(dest);
  fs.writeFileSync(path.join(dest, src), '');
  fn(src, { dirPath: dest });
  t.is(
    fs.readFileSync(src, 'utf8'),
    fs.readFileSync(path.resolve(dest, path.basename(src)), 'utf8')
  );
});

test('--add', t => {
  const { src, dest } = t.context;
  fs.writeFileSync(src, '');
  fn(src, { add: true, dirPath: dest });
  t.is(
    fs.readFileSync(path.resolve(dest, path.basename(src)), 'utf8'),
    fs.readFileSync(src, 'utf8')
  );
});

test('throw err', t => {
  const err = t.throws(() => fn(23), TypeError);
  t.is(err.message, 'Expected a string, got number');
});
