const request = require("supertest");

const app = require("../src/app");

describe("GET /api/v1", () => {
  it("responds with a json message", (done) => {
    request(app)
      .get("/api/v1")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        200,
        {
          message: "API - 👋🌎🌍🌏",
        },
        done
      );
  });
});

describe("GET /api/v1/url", () => {
  it("responds with a json message", (done) => {
    request(app)
      .get("/api/v1/url")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(
        200,
        {
          message:
            "Generate a url by choosing a slug to go to at https://localhost:3000/api/v1/url/:slug",
        },
        done
      );
  });
});
