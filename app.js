const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controller");
app.use(express.json());

app.get("/api/categories", getCategories);
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

module.exports = app;
