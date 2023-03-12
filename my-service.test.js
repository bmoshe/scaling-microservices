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

  test(`my-service to become ready within ${maxTimeout}ms`, async() => {
    let res = await loopUntil(async () => {
      const res = await fetch('http://localhost:3000/ready');
      return res.status < 400 ? res : undefined;
    }, maxTimeout);

    expect(res?.ok).toBeTruthy();
    expect(res?.status).toBe(200);
  });

  test('my-service is ready to serve', async () => {
    const res = await fetch('http://localhost:3000/some-endpoint');
    expect(res.ok).toBeTruthy();
  });

  let postSignalRequest = undefined;
  let postSignalResponse = undefined;
  test('in-flight requests are able to complete while shutting down', async () => {
    let reqFailedSoFar = false;
    const req = fetch('http://localhost:3000/some-endpoint')
        .catch(() => reqFailedSoFar = true);

    await kill(myService);

    postSignalRequest = fetch('http://localhost:3000/some-endpoint')
      .then(res => postSignalResponse = res)
      .catch(rej => postSignalResponse = rej);

    expect(reqFailedSoFar).toBeFalsy();
    const res = await req;
    expect(res?.ok).toBeTruthy();
  });

  test('requests received after graceful shutdown are denied', async() => {
    expect(postSignalRequest).toBeDefined();
    await postSignalRequest;
    expect(postSignalResponse?.ok).toBeFalsy();
  });

  afterAll(async () => {
    await kill(myService);
  });
});
