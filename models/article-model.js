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

function fetchArticles(
  topic,
  sort_by = "created_at",
  order = "DESC",
  p,
  limit = 10
) {
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
  if (
    !validSortBy.includes(sort_by) ||
    !validOrder.includes(order) ||
    !typeof limit === "number" ||
    !typeof p === "number"
  ) {
    return Promise.reject({ status: 400, msg: "invalid query value" });
  }

  let sqlStr = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
      COUNT (comments.article_id)::int 
      AS comment_count, 
      COUNT (*) OVER() ::int AS total_count 
      FROM articles 
      LEFT JOIN comments 
      ON articles.article_id = comments.article_id `;

  let queryVal = [];
  if (topic) {
    queryVal.push(topic);
    sqlStr += `WHERE topic=$1 `;
  }

  sqlStr += `GROUP BY articles.article_id 
      ORDER BY ${sort_by} ${order}`;

  if (p) {
    sqlStr += ` LIMIT ${limit} OFFSET ${limit} * ${p - 1};`;
  }

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

function updateArticle(inc_votes, article_id) {
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

function insertArticle(
  title,
  topic,
  author,
  body,
  article_img_url = "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
) {
  return db
    .query(
      `INSERT INTO articles (title, topic, author, body, article_img_url)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING *;`,
      [title, topic, author, body, article_img_url]
    )
    .then(({ rows }) => {
      const article = rows[0];
      article.comment_count = 0;
      return article;
    });
}

function removeArticle(article_id) {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1 RETURNING *;`, [
      article_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
    });
}

module.exports = {
  fetchArticleById,
  fetchArticles,
  checkArticleExists,
  updateArticle,
  insertArticle,
  removeArticle,
};
