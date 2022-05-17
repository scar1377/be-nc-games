const res = require("express/lib/response");
const db = require("../db/connection");

const reviewQueryStr = `
SELECT reviews.*, 
COUNT (comments.comment_id) ::INT AS comment_count 
FROM reviews
LEFT JOIN comments
ON reviews.review_id = comments.review_id
`;
const reviewByIdQueryStr = `
${reviewQueryStr}
WHERE reviews.review_id =$1
GROUP BY reviews.review_id
`;
exports.fetchReviewById = (id) => {
  return db.query(reviewByIdQueryStr, [id]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "review does not exist",
      });
    }

    return rows[0];
  });
};

exports.updateReviewById = (id, updatedVote) => {
  const { inc_votes } = updatedVote;
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "missing required fields",
    });
  }
  if (typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "incorrect value type",
    });
  }
  return db
    .query(
      "UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *",
      [id, inc_votes]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "review does not exist",
        });
      }
      return rows[0];
    });
};

exports.fetchAllReviews = () => {
  let queryStr = `${reviewQueryStr} GROUP BY reviews.review_id ORDER BY reviews.created_at DESC`;
  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};
