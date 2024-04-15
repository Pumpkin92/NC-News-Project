const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topic-controller");

app.get("/api/topics", getTopics);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "endpoint not found" });
});

module.exports = app;
