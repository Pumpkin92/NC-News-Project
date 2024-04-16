const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const endpointData = require("../endpoints.json");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("/api/topics", () => {
  test("GET 200: Responds with an array of topic objects with the correct properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(3);
        body.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
  test("GET 404 Responds with a 404 error and not found when URL does not match an endpoint", () => {
    return request(app)
      .get("/api/topics!")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("endpoint not found");
      });
  });
});

describe("/api", () => {
  test("GET 200 Responds with a description of all endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpointData);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("GET 200 Responds with an article object containing the correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article_id).toBe(1);
        expect(body.title).toBe("Living in the shadow of a great man");
        expect(body.topic).toBe("mitch");
        expect(body.author).toBe("butter_bridge");
        expect(body.body).toBe("I find this existence challenging");
        expect(typeof body.created_at).toBe("string");
        expect(body.votes).toBe(100);
        expect(body.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET 404 Responds with a status 400 when a request made for an article id that doesnt exist", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
  test("GET 400 Responds with a status 400 when an invalid request made to the articles endpoint", () => {
    return request(app)
      .get("/api/articles/puppies")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200 Responds with a status 200 and returns an array of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(13);
        body.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
      });
  });

  test("GET 200 Responds with the array of articles sorted in decsending order by date as the default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200 Responds with an array not containing a body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        body.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("GET 200 Responds with the correct number of comments", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body[0].comment_count).toBe(2);
      });
  });
});
