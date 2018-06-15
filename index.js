#!/usr/bin/env node

const path = require('path');
const doctor = require('./doctor');
const chalk = require('chalk');

const checks = require(path.join(process.cwd(), './doctor.json'));

const checksResultPromise = doctor.parse(checks);

console.log(' 👩‍⚕️ Checking your system for configuration problems... \n');
checksResultPromise.forEach(p =>
  p.then(({ message, fix, ok }) => {
    console.log(`\n   ${chalk.gray(message)}`);
    if (!ok && fix) {
      console.log(`         ${chalk.gray('Fix:')}`);
      console.log(`         ${chalk.yellow(fix)}`);
    }
  })
);

(async () => {
  const isOk = await doctor.isOk(checksResultPromise);
  const exitSymbol = isOk ? '👌' : '🤒';
  console.log(`\n   ${exitSymbol}`);
  process.exitCode = isOk ? 0 : 1;
})();
