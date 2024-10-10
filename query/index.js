const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = 4002;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const postByIdWithComments = {};

//route that listens to anything sending post on /events route
app.post('/events', (req, res, next) => {
  const { type, data } = req.body;
  console.log('event type received in query server: ', type);
  console.log('event data received in query server: ', data);
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
      postByIdWithComments[data.postId].comments.push(data.content);
      break;
    default:
      '';
  }
  console.log('postByIdWithComments: ', postByIdWithComments);

  res.send(postByIdWithComments);
});

app.listen(PORT, () => console.log(`query server listening on port: ${PORT}`));
