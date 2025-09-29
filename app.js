const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to DB"))
  .catch((e) => console.log("DB connection error", e));

app.use(express.json());
app.use((req, res, next) => {
  req.user = { _id: "68bddd9d5346c8f5a325411eb" };
  next();
});

const routes = require("./routes");

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
