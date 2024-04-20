const {
  fetchArticleById,
  fetchArticles,
  insertArticle,
  checkArticleExists,
  updateArticle,
  removeArticle,
} = require("../models/article-model");
const { checkTopicExists } = require("../models/topic-model");

function getArticleById(req, res, next) {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticles(req, res, next) {
  const { topic, sort_by, order, p, limit } = req.query;
  Promise.all([
    fetchArticles(topic, sort_by, order, p, limit),
    checkTopicExists(topic),
  ])
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function patchArticle(req, res, next) {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  Promise.all([
    updateArticle(inc_votes, article_id),
    checkArticleExists(article_id),
  ])
    .then(([updatedComment]) => {
      res.status(200).send({ updatedComment });
    })
    .catch((err) => {
      next(err);
    });
}

function postArticle(req, res, next) {
  const { title, topic, author, body, article_img_url } = req.body;
  insertArticle(title, topic, author, body, article_img_url)
    .then((postedArticle) => {
      res.status(201).send({ postedArticle });
    })
    .catch((err) => {
      next(err);
    });
}

function deleteArticle(req, res, next) {
  const { article_id } = req.params;
  removeArticle(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getArticleById,
  getArticles,
  patchArticle,
  postArticle,
  deleteArticle,
};
