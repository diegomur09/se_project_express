const routes = require("express").Router();
const clothingItems = require("./clothingItems");
const userRouter = require("./users");
const NotFoundError = require("../errors/not-found-error");
const { login, createUser } = require("../controllers/users");
const {
  validateLogin,
  validateUserBody,
} = require("../middlewares/validation");

routes.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

routes.post("/signin", validateLogin, login);
routes.post("/signup", validateUserBody, createUser);

routes.use("/items", clothingItems);
routes.use("/users", userRouter);

routes.use((req, res, next) => {
  next(new NotFoundError("Router not found"));
});

module.exports = routes;
