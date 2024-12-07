const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connecToDb = require("./db/db");
const cors = require("cors");
const userRoutes = require("./routes/user.route");

const app = express();

connecToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello Url");
});

module.exports = app;
