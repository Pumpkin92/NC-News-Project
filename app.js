const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topic-controller");
const { getEndpoints } = require("./controllers/endpoint-controller");

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "endpoint not found" });
});
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
