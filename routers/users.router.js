const express = require("express");
const usersRouter = express.Router();
const { getUsers, getUser } = require("../controllers/users-controller");

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUser);

module.exports = usersRouter;
