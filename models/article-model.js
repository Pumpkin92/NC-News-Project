const db = require("../db/connection");
function fetchArticleById(id) {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
}

function fetchArticles(topic) {
  let sqlStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
      COUNT (comments.article_id)::int 
      AS comment_count 
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id `;
  let queryVal = [];
  if (topic) {
    queryVal.push(topic);
    sqlStr += `WHERE topic=$1 `;
  }

  sqlStr += `GROUP BY articles.article_id 
      ORDER BY articles.created_at DESC;`;

  return db.query(sqlStr, queryVal).then(({ rows }) => {
    return rows;
  });
}

function checkArticleExists(id) {
  return db
    .query(`SELECT * from articles WHERE article_id = $1`, [id])
    .then(({ rows: articles }) => {
      if (articles.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return articles[0];
    });
}

function insertArticle(inc_votes, article_id) {
  return db
    .query(
      `UPDATE articles 
        SET votes = votes + $1 
        WHERE article_id = $2 
        RETURNING *; `,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = {
  fetchArticleById,
  fetchArticles,
  checkArticleExists,
  insertArticle,
};
