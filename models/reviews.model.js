const res = require("express/lib/response");
const db = require("../db/connection");

exports.fetchReviewById = (id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [id])
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
