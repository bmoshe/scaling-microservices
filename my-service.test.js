const { describe, expect, test, beforeAll, afterAll } = require('@jest/globals');
const { exec } = require('child_process');
const { loopUntil, kill } = require('./extensions');

describe('Testing my-service', () => {
  let myService = undefined;
  beforeAll(async () => {
    myService = exec('npm start');
  });

  const maxTimeout = 5000;
  test(`my-service should become alive within ${maxTimeout}ms`, async() => {
    let res = await loopUntil(async () => {
      try {
        return await fetch('http://localhost:3000/healthy');
      } catch (e) {
        // It's ok, our service might not be up, just yet.
      }
    }, maxTimeout);

    expect(res?.ok).toBeTruthy();
  });

  test('my-service is ready to serve', async () => {
    const res = await fetch('http://localhost:3000/some-endpoint');
    expect(res.ok).toBeTruthy();
  });

  afterAll(async () => {
    await kill(myService);
  });
});
