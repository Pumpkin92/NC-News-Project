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

module.exports = { fetchTopics, checkTopicExists };
