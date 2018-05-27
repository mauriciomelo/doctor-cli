const cp = require('child_process');

const symbols = {
  SUCCESS: '✅',
  ERROR: '❌',
};

const parse = ({ checks }) =>
  checks.map(
    check =>
      new Promise(resolve =>
        cp.exec(check.check, error => {
          const ok = !error;
          const symbol = ok ? symbols.SUCCESS : symbols.ERROR;
          const message = `${symbol}  ${check.title}`;
          resolve({
            message,
            ok,
          });
        })
      )
  );

const isOk = checksResultPromise =>
  Promise.all(checksResultPromise).then(checksResult => {
    return checksResult.every(({ ok }) => ok);
  });

module.exports = {
  parse,
  isOk,
};
