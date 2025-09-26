const routes = require("express").Router();
const clothingItems = require("./clothingItems");
const userRouer = require("./users");

routes.use("/items", clothingItems);
routes.use("/users", userRouer);

routes.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
});

module.exports = routes;
