const request = require("supertest");
const app = require("../app");

const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

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
            created_at: expect.any(String),
            votes: 1,
          });
        });
    });
    test("status:400 responds with an error message", () => {
      return request(app)
        .get("/api/reviews/not-an-id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
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

describe("/api/users", () => {
  test("status:200 reponds with an array of user objects", () => {
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
