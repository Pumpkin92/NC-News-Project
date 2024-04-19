const express = require("express");
const { getEndpoints } = require("../controllers/endpoint-controller");
const { getTopics } = require("../controllers/topic-controller");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");
const usersRouter = require("./users.router");
const apiRouter = express.Router();

apiRouter.use(express.json());
apiRouter.get("/", getEndpoints);
apiRouter.get("/topics", getTopics);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
