const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topic-controller");
const { getEndpoints } = require("./controllers/endpoint-controller");
const { getArticleById } = require("./controllers/article-controller");

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "endpoint not found" });
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Bad request" });
  }
  next(err);
});
app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
