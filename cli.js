#!/usr/bin/env node
'use strict'

const favjunk = require('./favjunk');
const yargs = require('yargs');

const showList = function(symbol, list) {
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

const argv = yargs
  .command('init', 'init', {}, favjunk.init)
  .command('show', 'show', {}, (argv) => {
    const list = favjunk.load().hash.map(hash => ({ hash, path: '' }));
    showList('>', list);
  })
  .command('add <file...>', 'add desc', {}, (argv) => {
    const list = favjunk.add(argv.file);
    showList('+', list);
  })
  .command('rm <file...>', 'remove desc', {}, (argv) => {
    const list = favjunk.remove(argv.file);
    showList('-', list);
  })
  .command('check', 'show will delete files', options, (argv) => {
    const list = favjunk.check(argv.path, argv.recursive);
    showList('M', list);
  })
  .command(['$0', 'exec'], 'delete files', options, (argv) => {
    const list = favjunk.exec(argv.path, argv.recursive);
    showList('D', list);
  })
  .help()
  .alias('help', 'h')
  .alias('version', 'v')
  .argv;

