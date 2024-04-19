const express = require("express");
const articlesRouter = express.Router();
const {
  getArticles,
  getArticleById,
  patchArticle,
} = require("../controllers/article-controller");
const {
  getComments,
  postComment,
} = require("../controllers/comment-controller");

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", patchArticle);
articlesRouter.get("/:article_id/comments", getComments);
articlesRouter.post("/:article_id/comments", postComment);

module.exports = articlesRouter;
