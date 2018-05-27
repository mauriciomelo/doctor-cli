#!/usr/bin/env node

const path = require('path');
const doctor = require('./doctor');

const checks = require(path.join(process.cwd(), './doctor.json'));

const checksResultPromise = doctor.parse(checks);

console.log('👩‍⚕️ Checking your system for configuration problems... \n');
checksResultPromise.forEach(p =>
  p.then(({ message }) => console.log(`   ${message}\n`))
);

(async () => {
  const isOk = await doctor.isOk(checksResultPromise);
  const exitSymbol = isOk ? '👌' : '🤒';
  console.log(`   ${exitSymbol}`);
  process.exitCode = isOk ? 0 : 1;
})();
