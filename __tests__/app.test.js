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
