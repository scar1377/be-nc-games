const request = require("supertest");
const app = require("../app");

const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const { convertTimestampToDate } = require("../db/seeds/utils");
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api/categories", () => {
  test("status:200 responds with an array of topic objects, each of which should have 'slug' and 'description' properties", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.categories).toHaveLength(4);
        body.categories.forEach((categories) => {
          expect(categories).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
  test("status:404 responds with an error message", () => {
    return request(app)
      .get("/api/categorie")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

describe("/api/reviews/:review_id", () => {
  describe("GET /api/reviews/:review_id", () => {
    test("status:200 responds with a matched review object ", () => {
      return request(app)
        .get("/api/reviews/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual({
            review_id: 1,
            title: "Agricola",
            designer: "Uwe Rosenberg",
            owner: "mallionaire",
            review_img_url:
              "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            review_body: "Farmyard fun!",
            category: "euro game",
            created_at: convertTimestampToDate({
              created_at: 1610964020514,
            }).created_at.toJSON(),
            votes: 1,
            comment_count: expect.any(Number),
          });
        });
    });
    test("status:400 responds with an error message", () => {
      return request(app)
        .get("/api/reviews/not-an-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("not a valid id input");
        });
    });
    test("status:404 responds with an error message", () => {
      return request(app)
        .get("/api/reviews/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("review does not exist");
        });
    });
  });
  describe("Patch /api/reviews/:review_id", () => {
    test("status:200 responds with a matched updated review object", () => {
      const updatedVote = { inc_votes: 10 };
      return request(app)
        .patch("/api/reviews/1")
        .send(updatedVote)
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual(
            expect.objectContaining({
              review_id: 1,
              title: "Agricola",
              designer: "Uwe Rosenberg",
              owner: "mallionaire",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              review_body: "Farmyard fun!",
              category: "euro game",
              created_at: expect.any(String),
              votes: 11,
            })
          );
        });
    });
    test("status:200 responds with a matched updated review object", () => {
      const updatedVote = { inc_votes: -100 };
      return request(app)
        .patch("/api/reviews/1")
        .send(updatedVote)
        .expect(200)
        .then(({ body }) => {
          expect(body.review).toEqual(
            expect.objectContaining({
              review_id: 1,
              title: "Agricola",
              designer: "Uwe Rosenberg",
              owner: "mallionaire",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              review_body: "Farmyard fun!",
              category: "euro game",
              created_at: expect.any(String),
              votes: -99,
            })
          );
        });
    });
    test("status:400 responds with an error message of incorrect value type", () => {
      const updatedVote = { inc_votes: "not a number" };
      return request(app)
        .patch("/api/reviews/1")
        .send(updatedVote)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("incorrect value type");
        });
    });
    test("status:400 responds with an error message of missing required fields", () => {
      const updatedVote = {};
      return request(app)
        .patch("/api/reviews/1")
        .send(updatedVote)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("missing required fields");
        });
    });
    test("status:404 responds with an error message of review not found", () => {
      const updatedVote = { inc_votes: 10 };
      return request(app)
        .patch("/api/reviews/9999")
        .send(updatedVote)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("review does not exist");
        });
    });
  });
});

describe("GET /api/users", () => {
  test("status:200 responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/reviews", () => {
  test("status:200 responds with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toHaveLength(13);
        body.reviews.forEach((review) => {
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              owner: expect.any(String),
              review_img_url: expect.any(String),
              category: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  test("status:200 responds with an array of review objects in descending order", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("status:200 responds with an array of review objects sorted by title and in descending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test("status:200 responds with an array of review objects sorted by owner and in ascending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=owner&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeSortedBy("owner", {
          descending: false,
        });
      });
  });
  test("status:200 responds with an array of review objects within sorted by owner and in ascending order", () => {
    return request(app)
      .get("/api/reviews?category=social deduction&sort_by=owner&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews.length).toBe(11);
      });
  });
  test("status:400 responds with an error message when pass an invalid sort_by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=topic&order=desc")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid query input");
      });
  });
  test("status:400 responds with an error message when pass an invalid order query", () => {
    return request(app)
      .get("/api/reviews?sort_by=owner&order=invalidOrder")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid query input");
      });
  });
  test("status:404 responds with an error message when pass an invalid category", () => {
    return request(app)
      .get("/api/reviews?category=cat&sort_by=owner&order=desc")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("category does not exist");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("status:200 responds with an array of comment objects related to the certain review", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(3);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: expect.any(Number),
            })
          );
        });
      });
  });
  test("status:404 responds with an error message", () => {
    return request(app)
      .get("/api/reviews/9999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Review does not exist");
      });
  });

  //got really weird error. When the msg is the same as the one in the PsqlErrorHandler, got "invalid input syntax for type integer:"not-a-number", but putting the util function into controller will solve the problem"
  test("status:400 responds with an error message", () => {
    return request(app)
      .get("/api/reviews/not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("not a valid id input");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("status:200 responds with an array of topic objects, each of which should have 'slug' and 'description' properties", () => {
    const newComment = { username: "bainesface", body: "Testing comments" };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: expect.any(Number),
          body: "Testing comments",
          votes: 0,
          author: "bainesface",
          review_id: 2,
          created_at: expect.any(String),
        });
      });
  });
  test("status:400 responds with an error message of missing required fields", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("missing required fields");
      });
  });
  test("status:400 responds with an error message of invalid value type", () => {
    const newComment = { username: 1, body: 11 };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid value type");
      });
  });
  test("status:404 responds with an error message of user not found", () => {
    const newComment = { username: "7731racs", body: "wrong username" };
    return request(app)
      .post("/api/reviews/2/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user does not exist");
      });
  });
  test("status:404 responds with an error message of review not found", () => {
    const newComment = { username: "bainesface", body: "Testing comments" };
    return request(app)
      .post("/api/reviews/9999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review does not exist");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE status:204 responds with no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test.only("status:404 responds with an error message", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("comment does not exist");
      });
  });
});

describe("GET /api", () => {
  test("status:200 responds with the descriptions of all the endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body.endpoints)).toHaveLength(9);
        expect(body.endpoints["GET /api"]).toEqual({
          description:
            "serves up a json representation of all the available endpoints of the api",
        });
      });
  });
  test("status:404 responds with an error message", () => {
    return request(app)
      .get("/apii")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});
