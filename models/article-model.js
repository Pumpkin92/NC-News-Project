const db = require("../db/connection");
function fetchArticleById(id) {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, articles.article_img_url,
      COUNT (comments.article_id)::int 
      AS comment_count 
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id 
      WHERE articles.article_id=$1 
      GROUP BY articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
}

function fetchArticles(topic, sort_by = "created_at", order = "DESC") {
  const validSortBy = [
    "created_at",
    "title",
    "topic",
    "author",
    "votes",
    "comment_count",
    "body",
  ];
  const validOrder = ["ASC", "DESC"];
  if (!validSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid query value" });
  }
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "invalid query value" });
  }
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
      ORDER BY ${sort_by} ${order};`;

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
