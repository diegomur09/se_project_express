/* eslint-disable no-console */
const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3001 } = process.env;

// In test environment we skip connecting to the real database so tests can
// mock mongoose models and exercise the routes/controllers in isolation.
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect("mongodb://127.0.0.1:27017/wtwr_db")
    .then(() => console.log("Connected to DB"))
    .catch((e) => console.log("DB connection error", e));
}

app.use(express.json());
app.use((req, res, next) => {
  req.user = { _id: "68bddd9d5346c8f5a325411eb" };
  next();
});

const routes = require("./routes");

app.use(routes);

// Only start the server when not under test.
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
