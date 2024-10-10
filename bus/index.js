const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const PORT = 4005;

const app = express();
app.use(bodyParser.json());

/*
  NOTE: The bus server will send nothing to "storage" (a database, eventually).
        Yet it is possible to collect metadata on the traffic of every server.
*/


app.post("/events", (req, res, next) => {
  const event = req.body;
  console.log("event received in bus server: ", event)

  axios.post("http://localhost:4000/events", event).catch(e => console.error(e)); //post server
  axios.post("http://localhost:4001/events", event).catch(e => console.error(e)); //comments server
  axios.post("http://localhost:4002/events", event).catch(e => console.error(e)); //query server
  res.send(event)

})



app.listen(PORT, () => console.log(`bus server listening on port: ${PORT}`));
