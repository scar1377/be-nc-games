const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

exports.fetchCommentsByReviewId = (id) => {
  const p1 = db.query("SELECT * FROM comments WHERE review_id = $1", [id]);
  //   const p2 = db.query("SELECT * FROM reviews WHERE review_id = $1", [id])
  //   const isValid = await checkExists(
  // return checkExists("reviews", "review_id", id, "Review does not exist")
  //   .then((result) => {

  //     return p1;
  //   })
  return p1.then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 200,
        msg: "No comments related to this article",
      });
    }
    return rows;
  });
  //   return Promise.all([p1, isValid]).then(([comments, isValid]) => {
  //     if (isValid && comments.rows.length !== 0) {
  //       return comments.rows;
  //     }
  //     return Promise.reject({
  //       status: 200,
  //       msg: "No comments related to this article",
  //     });
  //   });
  //   console.log(isValid, "<<<<<<<<<<exist???");
  //   if (isValid) {
  //     return db
  //       .query("SELECT * FROM comments WHERE review_id = $1", [id])
  //       .then(({ rows }) => {
  //         if (!rows.length) {
  //           return Promise.reject({status: 200, msg:"No comments related to this article"});
  //         }
  //         return rows;
  //       });
  //   }
};

exports.addCommentByReviewId = (id, newComment) => {
  const { username, body } = newComment;

  if (username && body) {
    if (typeof username !== "string" || typeof body !== "string") {
      return Promise.reject({
        status: 400,
        msg: "invalid value type",
      });
    }
  }

  const queryStr = `
    INSERT INTO comments (
        review_id,
        author, 
        body
        )
        VALUES ($1,$2,$3)
        RETURNING *
      `;

  return db
    .query(queryStr, [id, username, body])

    .then(({ rows }) => {
      return rows[0];
    });
  //   return db.query(queryStr, [id, username, body]).then(({rows})=> {
  //       return rows[0]
  //   })
};
