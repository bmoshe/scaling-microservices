const Express = require('express');

const app = new Express();

app.get('/healthy', (req, res) => {
  res.sendStatus(200);
});

app.get('/some-endpoint', (req, res) => {
  res.send('Hi, from my-service');
});

const port = +(process.env.PORT || 3000);
app.listen(port, () => console.log('I\'m up!'));
