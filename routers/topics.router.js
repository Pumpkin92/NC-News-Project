const express = require("express");
const topicsRouter = express.Router();
const { getTopics, postTopic } = require("../controllers/topic-controller");

topicsRouter.get("/", getTopics);
topicsRouter.post("/", postTopic);

module.exports = topicsRouter;
