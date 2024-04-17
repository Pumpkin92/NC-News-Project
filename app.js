const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topic-controller");
const { getEndpoints } = require("./controllers/endpoint-controller");
const {
  getArticleById,
  getArticles,
  patchArticle,
} = require("./controllers/article-controller");
const {
  getComments,
  postComment,
  deleteComment,
} = require("./controllers/comment-controller");
const { getUsers } = require("./controllers/users-controller");

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.get("/api/users", getUsers);

app.use(express.json());

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "endpoint not found" });
});

app.use((err, request, response, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "23503") {
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
