const db = require("../db/connection");

function fetchComments(id) {
  return db
    .query(
      `SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC;`,
      [id]
    )
    .then(({ rows }) => {
      return rows;
    });
}

module.exports = { fetchComments };
