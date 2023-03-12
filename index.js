const Express = require('express');
const { createServer } = require('http');
const { promisify } = require('util');
const { isReady } = require('./dependencies');
const { sleep } = require('./extensions');

const app = new Express();
const server = createServer(app);

app.get('/healthy', (req, res) => {
  res.sendStatus(200);
});

app.get('/ready', (req, res) => {
  if(isReady()) {
    res.sendStatus(200); // OK
  } else {
    res.sendStatus(503); // Service Unavailable
  }
});

app.get('/some-endpoint', async (req, res) => {
  if(isReady()) {
    await sleep(500);
    res.send('Hi, from my-service');
  } else {
    res.sendStatus(503); // Service Unavailable
  }
});

const port = +(process.env.PORT || 3000);
server.listen(port, () => console.log('I\'m up!'));

const serverClose = promisify(server.close.bind(server));
process.on('SIGTERM', async () => {
  console.log('ENTER Graceful shutdown');
  await serverClose();
  console.log('LEAVE Graceful shutdown');
});