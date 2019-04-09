#!/usr/bin/env node
'use strict'

const favjunk = require('./favjunk');
const yargs = require('yargs');

const showList = function (symbol, list) {
  list.forEach((item) => {
    console.log(`${symbol} [${item.hash}] ${item.path}`);
  });
};

const options = {
  path: {
    alias: 'p',
    type: 'string',
    desc: 'path',
    default: '.',
  },
  recursive: {
    alias: 'r',
    type: 'boolean',
    desc: 'recursively',
    default: false,
  },
};

yargs
  .detectLocale(false)
  .command('$0', 'unlink matched file(s)', options, (argv) => {
    const list = favjunk.exec(argv.path, argv.recursive);
    showList('D', list);
  })
  .command('check', 'show matched file(s)', options, (argv) => {
    const list = favjunk.check(argv.path, argv.recursive);
    showList('M', list);
  })
  .command('add <file...>', 'add file(s) to favorite list', {}, (argv) => {
    const list = favjunk.add(argv.file);
    showList('+', list);
  })
  .command('rm <file...>', 'remove file(s) from favorite list', {}, (argv) => {
    const list = favjunk.remove(argv.file);
    showList('-', list);
  })
  .help()
  .alias('help', 'h')
  .argv;

