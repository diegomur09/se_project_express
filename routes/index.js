const routes = require("express").Router();
const clothingItems = require("./clothingItems");
const userRouter = require("./users");

const { STATUS_NOT_FOUND } = require("../utils/errors");

routes.use("/items", clothingItems);
routes.use("/users", userRouter);

routes.use((req, res) => {
  res.status(STATUS_NOT_FOUND).send({ message: "Router not found" });
});

module.exports = routes;
