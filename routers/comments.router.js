const express = require("express");
const commentsRouter = express.Router();
const { deleteComment } = require("../controllers/comment-controller");

commentsRouter.delete("/:comment_id", deleteComment);
module.exports = commentsRouter;
