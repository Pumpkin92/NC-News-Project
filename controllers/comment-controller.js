const { fetchComments } = require("../models/comment-model");
const { checkArticleExists } = require("../models/article-model");

function getComments(req, res, next) {
  const { article_id } = req.params;
  Promise.all([fetchComments(article_id), checkArticleExists(article_id)])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getComments };
