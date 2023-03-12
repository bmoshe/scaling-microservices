const { createGracefulExpress } = require('./graceful-express');
const { isReady } = require('./dependencies');
const { sleep } = require('./extensions');

const { app, server, } = createGracefulExpress();

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
