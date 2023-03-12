const Express = require('express');
const { isReady } = require('./dependencies');

const app = new Express();

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
    res.send('Hi, from my-service');
  } else {
    res.sendStatus(503); // Service Unavailable
  }
});

const port = +(process.env.PORT || 3000);
app.listen(port, () => console.log('I\'m up!'));
