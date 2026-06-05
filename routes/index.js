const routes = require("express").Router();
const clothingItems = require("./clothingItems");
const userRouter = require("./users");
const NotFoundError = require("../errors/not-found-error");

routes.use("/items", clothingItems);
routes.use("/users", userRouter);

routes.use((req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = routes;
