const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controller");
const {
  getReviewById,
  patchReviewById,
  getAllReviews,
} = require("./controllers/reviews.controller");
const {
  handle500ServerError,
  handleCustomsError,
  handlePsqlError,
} = require("./controllers/error.controller");
const { getUsers } = require("./controllers/users.controller");
const {
  getCommentsByReviewId,
  postCommentByReviewId,
  deleteCommentById,
} = require("./controllers/comments.controller");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReviewById);
app.patch("/api/reviews/:review_id", patchReviewById);

app.get("/api/users", getUsers);

app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postCommentByReviewId);
app.delete("/api/comments/:comment_id", deleteCommentById);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "path not found" });
});

app.use(handlePsqlError);
app.use(handleCustomsError);
app.use(handle500ServerError);

module.exports = app;
