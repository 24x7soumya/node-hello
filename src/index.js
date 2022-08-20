const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const redis = require('redis');

const client = redis.createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

//Allow all requests from all domains & localhost
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/ingredients', async function(req, res) {
    await client.connect();
    await Promise.all(Object.entries(req.query).map(async([key, value]) => await client.set(key, value)));
    await client.disconnect();
    res.send(req.query);
});

app.get('/ingredients/:key', async function(req, res) {
    await client.connect();
    const value = await client.get(req.params.key);
    await client.disconnect();
    res.send(value);
});

app.listen(3000);