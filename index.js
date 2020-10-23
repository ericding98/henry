#!/usr/bin/node

'use strict';

const {
  appendFile,
} = require('fs');
const {
  createInterface,
} = require('readline');
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', line => {
  console.log(line);
  const domainStr = line.toString();
  const domain = domainStr
    .substring(10)
    .trim()
    .replace(/ +/g, '.')
    .replace('\t', '.');
  if (domain.length <= 3) return;
  if (!domain.includes('.')) return;
  appendFile('./log.csv', `${Date.now()},${domain}\n`, () => {});
});
