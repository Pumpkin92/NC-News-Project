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
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "not found" });
      }
      return rows[0];
    });
}

function removeComment(comment_id) {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    });
}

function updateCommentVotes(inc_votes, comment_id) {
  return db
    .query(
      `UPDATE comments 
        SET votes = votes + $1 
        WHERE comment_id = $2 
        RETURNING *; `,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
      return rows[0];
    });
}

module.exports = {
  fetchComments,
  insertComment,
  removeComment,
  updateCommentVotes,
};
