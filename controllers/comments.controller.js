const { checkExists } = require("../db/seeds/utils");
const {
  fetchCommentsByReviewId,
  addCommentByReviewId,
} = require("../models/comments.model");

exports.getCommentsByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  checkExists("reviews", "review_id", review_id, "Review does not exist")
    .then(() => {
      return fetchCommentsByReviewId(review_id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByReviewId = (req, res, next) => {
  const { review_id } = req.params;
  const body = req.body;

  checkExists("reviews", "review_id", review_id, "review does not exist")
    .then((result) => {
      return addCommentByReviewId(review_id, body).then((comment) => {
        res.status(201).send({ comment });
      });
    })
    .catch((err) => {
      next(err);
    });
};
