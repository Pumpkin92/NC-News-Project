const { fetchTopics } = require("../models/topic-model");

function getTopics(req, res, next) {
  fetchTopics()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getTopics };
