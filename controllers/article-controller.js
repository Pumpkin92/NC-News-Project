const { fetchArticleById } = require("../models/article-model");

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

module.exports = { getArticleById };
