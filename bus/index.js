const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const PORT = 4005;

const app = express();
app.use(bodyParser.json());

const events = []; // keep record of events in case some other server goes down: restart querry server and get all events stored from bus server

app.post('/events', (req, res, next) => {
  const event = req.body;
  events[events.length] = event;
  console.log('event received in bus server: ', event);
  axios
    .post('http://posts-clusterip-srv:4000/events', event)
    .catch((e) => console.error(e)); //post server
  axios
    .post('http://comments-srv:4001/events', event)
    .catch((e) => console.error(e)); //comments server
  axios
    .post('http://query-srv:4002/events', event)
    .catch((e) => console.error(e)); //query server
  axios
    .post('http://moderation-srv:4003/events', event)
    .catch((e) => console.error(e)); //moderation server
  res.send({message: "event received"});
});

app.get('/events', (req, res, next) => {
  res.send(events);
});

app.listen(PORT, () => {
  console.log('v10');
  console.log(`bus server listening on port: ${PORT}`);
});
