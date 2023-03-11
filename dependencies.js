const { sleep } = require('./extensions');

let isCacheEnabled = false;
let isDbEnabled = false;

async function initDependencies() {
  await sleep(2000);
  isCacheEnabled = true;
  console.log('Caching is ready');

  await sleep(1000);
  isDbEnabled = true;
  console.log('DB is ready');
}

initDependencies();

function isCacheReady() {
  return isCacheEnabled;
}

function isDbReady() {
  return isDbEnabled;
}

function isReady() {
  return isCacheReady() && isDbReady();
}

module.exports = { isCacheReady, isDbReady, isReady };