const { promisify } = require('util');
const { exec } = require('child_process');

const execAsPromise = promisify(exec);
async function kill(childProcess) {
  try {
    await execAsPromise(`kill -TERM ${childProcess.pid}`);
  } catch(e) {
    // Normal graceful shutdown flow..
  }
}

async function loopUntil(f, duration) {
  let hasTimeoutReached = false;
  const timeout = setTimeout(() => hasTimeoutReached = true, duration);

  let res = undefined;
  while (!hasTimeoutReached && !res) {
    res = await f();
  }

  clearTimeout(timeout);
  return res;
}

module.exports = { kill, loopUntil, };
