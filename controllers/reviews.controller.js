const { checkExists } = require("../db/seeds/utils");
const {
  fetchReviewById,
  updateReviewById,
  fetchAllReviews,
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

exports.getAllReviews = (req, res, next) => {
  const { sort_by, order, category } = req.query;
  const promiseAllArr = [fetchAllReviews(sort_by, order, category)];
  if (category)
    promiseAllArr.push(
      checkExists("categories", "slug", category, "category does not exist")
    );
  Promise.all(promiseAllArr)
    .then(([reviews]) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
};
