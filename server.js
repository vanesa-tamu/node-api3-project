const express = require('express');

const server = express();

const userRouter = require("./users/userRouter.js");
const postRouter = require('./posts/postRouter.js');

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
function logger(req, res, next) {
  console.log(
    `Request method: ${req.method}, request URL: 
    ${req.url}, timestamp: ${new Date()}`
  );
  next();
}

server.use(logger);
server.use(express.json());

server.use('/api/users', userRouter);
server.use('/api/posts', postRouter)

module.exports = server;
