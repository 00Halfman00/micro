const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const PORT = 4002;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const postByIdWithComments = {};

const handleEvent = (type, data) => {
  switch (type) {
    case 'POST_CREATED':
      postByIdWithComments[data.id] = {
        id: data.id,
        title: data.title,
        content: data.content,
        comments: [],
      };
      break;
    case 'COMMENT_CREATED':
      postByIdWithComments[data.postId].comments.push(data);
      break;
    case 'COMMENT_UPDATED':
      const comment = postByIdWithComments[data.postId].comments.find(
        (c) => c.id === data.id
      );
      comment.status = data.status;
      comment.content = data.content;
    default:
      '';
  }
};

app.get('/events', (req, res, next) => {
  res.send(postByIdWithComments);
});

app.post('/events', (req, res, next) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  console.log(req.body);

  res.send(postByIdWithComments);
});

app.listen(PORT, () => {
  axios
    .get('http://bus-srv:4005/events')
    .then(({ data }) => {
      console.log("data: ", data)
      data.forEach((e) => {
        handleEvent(e.type, e.data);
      });
    })
    .catch((e) => console.error(e));

  console.log(`query server listening on port: ${PORT}`);
  console.log("query server v10")
});
