const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const { randomBytes } = require('crypto');
const cors = require('cors');
const PORT = 4000;


/*
  NOTE: The post server will send to "storage" (a database, eventually) only post info;
        that is, it will send to storage an object containing the post id, post title,
        and post content. It will not store a record of the comments that will later be
        associated with the post.
*/
const posts = {};

app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res, next) => {
  res.send(posts);
});

app.post('/posts', (req, res, next) => {
  console.log('posting in post')
  const { title, content } = req.body;
  const id = randomBytes(4).toString('hex');
  const post = { id, title, content };
  posts[id] = post;

  const event = {
    type: 'POST_CREATED',
    data: post,
  };

  axios
    .post('http://localhost:4005/events', event)
    .catch((e) => console.error(e));

  res.status(201).send(post);
});

app.post('/events', (req, res, next) => {
  const event = req.body;
  console.log('event received in post server: ', event);
  res.send({message: "event received. thx"});
});

app.listen(PORT, () => console.log(`post server listening on port: ${PORT}`));
