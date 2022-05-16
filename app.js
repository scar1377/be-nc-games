const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controller");
const { getReviewById } = require("./controllers/reviews.controller");
const {
  handle500ServerError,
  handleCustomsError,
  handlePsqlError,
} = require("./controllers/error.controller");

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handlePsqlError);
app.use(handleCustomsError);
app.use(handle500ServerError);

module.exports = app;
