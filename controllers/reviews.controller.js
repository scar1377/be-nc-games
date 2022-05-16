const {
  fetchReviewById,
  updateReviewById,
} = require("../models/reviews.model");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewById(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.patchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const body = req.body;
  updateReviewById(review_id, body)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};
