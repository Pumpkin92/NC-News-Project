const db = require("../db/connection");

function fetchTopics() {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
}

function checkTopicExists(slug) {
  if (slug) {
    return db
      .query(`SELECT * from topics WHERE slug =$1`, [slug])
      .then(({ rows: topics }) => {
        if (topics.length === 0) {
          return Promise.reject({ status: 404, msg: "not found" });
        }
      });
  }
}

function insertTopic(slug, description) {
  if (!slug || !description) {
    return Promise.reject({ status: 400, msg: "Missing required properties" });
  }
  return db
    .query(
      `INSERT INTO topics (slug, description)
  VALUES ($1, $2)
  RETURNING *;`,
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
}

module.exports = { fetchTopics, checkTopicExists, insertTopic };
