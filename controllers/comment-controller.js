const {
  fetchComments,
  insertComment,
  removeComment,
} = require("../models/comment-model");
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

function postComment(req, res, next) {
  const { article_id } = req.params;
  const comment = req.body;
  insertComment(article_id, comment)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
}

function deleteComment(req, res, next) {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getComments, postComment, deleteComment };
