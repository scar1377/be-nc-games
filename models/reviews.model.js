const res = require("express/lib/response");
const db = require("../db/connection");

const reviewByIdQueryStr = `
SELECT reviews.*, 
COUNT (comments.comment_id) ::INT AS comment_count 
FROM reviews
LEFT JOIN comments
ON reviews.review_id = comments.review_id
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

  if (inc_votes && typeof inc_votes !== "number") {
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

exports.fetchAllReviews = (
  sort_by = "created_at",
  order = "desc",
  category
) => {
  let reviewQueryStr = `
SELECT reviews.title,
reviews.owner,
reviews.review_id,
reviews.category, 
reviews.review_img_url,
reviews.created_at,
reviews.votes,
COUNT (comments.comment_id) ::INT AS comment_count 
FROM reviews
LEFT JOIN comments
ON reviews.review_id = comments.review_id
`;
  const sortByGreenList = [
    "review_id",
    "title",
    "owner",
    "category",
    "created_at",
    "votes",
    "comment_count",
  ];
  const orderGreenList = ["asc", "desc"];
  const queryParams = [];
  if (!sortByGreenList.includes(sort_by) || !orderGreenList.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "invalid query input",
    });
  }
  if (category) {
    reviewQueryStr += `WHERE reviews.category = $1 `;
    queryParams.push(category);
  }

  reviewQueryStr += `GROUP BY reviews.review_id 
  ORDER BY ${sort_by} ${order}`;
  return db.query(reviewQueryStr, queryParams).then(({ rows }) => {
    return rows;
  });
};
