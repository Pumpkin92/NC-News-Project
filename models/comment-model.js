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

function insertComment(article_id, comment) {
  const { body, author } = comment;
  return db
    .query(
      `INSERT INTO comments (article_id, body, author) 
      VALUES ($1, $2, $3) 
      RETURNING *;`,
      [article_id, body, author]
    )
    .then((result) => {
      return result.rows[0];
    });
}

module.exports = { fetchComments, insertComment };
