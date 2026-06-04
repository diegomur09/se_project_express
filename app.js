const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { login, createUser } = require("./controllers/users");

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

app.post("/signin", login);
app.post("/signup", createUser);

const routes = require("./routes");

app.use(routes);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
