const { checkExists } = require("../db/seeds/utils");
const {
  fetchCommentsByReviewId,
  addCommentByReviewId,
  dropCommentById,
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
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  console.log(req.params, "<<<<<<<<<<<req.params");
  dropCommentById(comment_id)
    .then((response) => {
      console.log(response);
      res.status(204).end();
    })
    .catch(next);

  // const comment_id = req.params.comment_id;
  // const promises = [dropCommentById(comment_id)];
  // Promise.all(promises)
  //   .then((removedComment) => {
  //     res.status(204).send({ removedComment });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(404).send({ msg: "comment does not exist" });
  //   });
};
