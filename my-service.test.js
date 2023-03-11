const { describe, expect, test, beforeAll, afterAll } = require('@jest/globals');
const { exec } = require('child_process');
const { kill } = require('./extensions');

describe('Testing my-service', () => {
  let myService = undefined;
  beforeAll(async () => {
    myService = exec('npm start');
  });

  test('my-service is probably ready to serve', async () => {
    const res = await fetch('http://localhost:3000/some-endpoint');
    expect(res.ok).toBeTruthy();
  }); // Oh, isn't it?

  afterAll(async () => {
    await kill(myService);
  });
});
