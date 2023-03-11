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

module.exports = { kill, };
