const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { errors } = require("celebrate");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { validateLogin, validateUserBody } = require("./middlewares/validation");

const app = express();
const { PORT = 3001 } = process.env;

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect("mongodb://127.0.0.1:27017/wtwr_db")
    .then(() => console.log("Connected to DB"))
    .catch((e) => console.log("DB connection error", e));
}

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

app.post("/signin", validateLogin, login);
app.post("/signup", validateUserBody, createUser);

const routes = require("./routes");

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
