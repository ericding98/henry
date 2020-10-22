#!/usr/bin/node

'use strict';

const {
  appendFile,
} = require('fs');
const {
  reverse,
} = require('dns');
const {
  promisify,
} = require('util');
const {
  createInterface,
} = require('readline');
const reverseAsync = promisify(reverse);
const rl = createInterface({
  input: process.stdin
});

rl.on('line', async ip => {
  try {
    await formatAndWrite(ip.split(' -> ')[1].split(':')[0]);
  } catch (error) {
    // do nothing
  }
});

const formatAndWrite = async ip => {
  const domain = await reverseAsync(ip);
  await appendFile('./log.csv', `${Date.now()},${ip},${domain}\n`, () => {});
};
