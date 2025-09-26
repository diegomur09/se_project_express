const routes = require("express").Router();
const clothingItems = require("./clothingItems");

routes.use("/items", clothingItems);

routes.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});

module.exports = routes;
routes;
