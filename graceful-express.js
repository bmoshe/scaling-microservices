const Express = require('express');
const { createServer } = require('http');

const { promisify } = require('util');
const { isReady } = require('./dependencies');

function createGracefulExpress() {
  const app = new Express();
  const server = createServer(app);

  let isGracefullyShuttingDown = false;

  app.get('/healthy', (req, res) => {
    res.sendStatus(200);
  });

  app.use((req, res, next) => {
    if(isGracefullyShuttingDown) {
      res.sendStatus(503); // Service Unavailable
    } else {
      next();
    }
  });

  app.get('/ready', (req, res) => {
    if(isReady()) {
      res.sendStatus(200); // OK
    } else {
      res.sendStatus(503); // Service Unavailable
    }
  });

  const serverClose = promisify(server.close.bind(server));
  process.on('SIGTERM', async () => {
    console.log('ENTER Graceful shutdown');
    isGracefullyShuttingDown = true;
    await serverClose();
    console.log('LEAVE Graceful shutdown');
  });

  return { app, server, };
}

module.exports = { createGracefulExpress, };