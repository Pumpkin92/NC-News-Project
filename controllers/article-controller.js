const {
  fetchArticleById,
  fetchArticles,
  insertArticle,
  checkArticleExists,
} = require("../models/article-model");
const { checkTopicExists } = require("../models/topic-model");

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((err) => {
      next(err);
    });
}

function getArticles(req, res, next) {
  const { topic } = req.query;
  Promise.all([fetchArticles(topic), checkTopicExists(topic)])
    .then(([result]) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticle(req, res, next) {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  Promise.all([
    insertArticle(inc_votes, article_id),
    checkArticleExists(article_id),
  ])
    .then(([updatedComment]) => {
      res.status(200).send({ updatedComment });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticleById, getArticles, patchArticle };
