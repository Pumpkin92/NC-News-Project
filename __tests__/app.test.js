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
        const { topics } = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
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
    const objectCopy = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: expect.any(String),
      votes: 100,
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject(objectCopy);
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

  test("GET 200 Responds with a total count of of all the comments with the passed article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article.comment_count).toBe(11);
      });
  });

  test("PATCH 200 Responds with passed article containing the correct number of votes when the votes are incremented", () => {
    const patchedArticle = { inc_votes: 200 };
    return request(app)
      .patch("/api/articles/3")
      .send(patchedArticle)
      .expect(200)
      .then(({ body }) => {
        const { updatedComment } = body;
        expect(updatedComment).toMatchObject({
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: expect.any(String),
          votes: 200,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH 200 Responds with passed article containing the correct number of votes when the votes are decremented", () => {
    const patchedArticle = { inc_votes: -500 };
    return request(app)
      .patch("/api/articles/3")
      .send(patchedArticle)
      .expect(200)
      .then(({ body }) => {
        const { updatedComment } = body;
        expect(updatedComment).toMatchObject({
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: expect.any(String),
          votes: -500,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH 400 Responds with status 400 when attempting to patch an article with an invalid id", () => {
    const patchedArticle = { inc_votes: -500 };
    return request(app)
      .patch("/api/articles/puppies")
      .send(patchedArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("PATCH 404 Responds with status 404 when attempting to patch an article that doesnt exist in the database", () => {
    const patchedArticle = { inc_votes: -500 };
    return request(app)
      .patch("/api/articles/3000")
      .send(patchedArticle)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article not found");
      });
  });
});

describe("/api/articles", () => {
  test("GET 200 Responds with a status 200 and returns an array of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
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
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 200 Responds with an array not containing a body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body");
        });
      });
  });
  test("GET 200 Responds with the correct number of comments", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles[0].comment_count).toBe(2);
      });
  });
  test("GET 200 Accepts a topic query and responds with an array of articles from that query", () => {
    const objectCopy = {
      topic: "mitch",
      author: expect.any(String),
      title: expect.any(String),
      article_id: expect.any(Number),
      created_at: expect.any(String),
      votes: expect.any(Number),
      article_img_url: expect.any(String),
      comment_count: expect.any(Number),
    };
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article).toMatchObject(objectCopy);
        });
      });
  });
  test("GET 200 Accepts a topic query and responds with a 200 when the article exists but there are no comments ", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(0);
      });
  });
  test("GET 404 Responds with an error message for a topic that is not in the database", () => {
    return request(app)
      .get("/api/articles?topic=puppies")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("not found");
      });
  });
  test("GET 200 Responds with a 200 when passed a valid sort-by query ", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("GET 200 Responds with default sorting if no query entered ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { coerce: true });
      });
  });
  test("GET 400 Responds with a 400 if incorrect sorting criteria passed in ", () => {
    return request(app)
      .get("/api/articles?sort_by=puppies")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid query value");
      });
  });
  test("GET 200 Responds with a 200 when passed a valid order query ", () => {
    return request(app)
      .get("/api/articles?order=ASC")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { coerce: true });
      });
  });
  test("GET 200 Responds with default order if no query entered ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 400 Responds with a 400 if incorrect sorting criteria passed in ", () => {
    return request(app)
      .get("/api/articles?order=puppies")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid query value");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("Get 200 Responds with an array of comments for the selected article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("GET 200 Responds with the array of comments sorted in descending order by date as the default", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET 404 Responds with a status code 404 and message 'not found' when passed an article id that doesnt exist in the database", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article not found");
      });
  });
  test("GET 400 Responds with a status code 400 and message 'bad request' when passed an invalid article id", () => {
    return request(app)
      .get("/api/articles/puppies/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("GET 200 Responds with an empty array when passed a valid article id that contains no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments.length).toBe(0);
      });
  });
  test("POST 201 Adds a new comment to the passed article id and responds with the new comment", () => {
    const newComment = {
      body: "This is a comment",
      author: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { postedComment } = body;
        expect(postedComment).toEqual({
          article_id: 2,
          body: "This is a comment",
          author: "icellusedkars",
          comment_id: 19,
          created_at: expect.any(String),
          votes: 0,
        });
      });
  });

  test("POST 400 Responds with status 400 and bad request when passed a comment without all the required properties", () => {
    const newComment = { body: "This is a comment" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST 400 Responds with status 400 and bad request when attempting to post a comment to an invalid article id", () => {
    const newComment = { body: "This is a comment", author: "icellusedkars" };
    return request(app)
      .post("/api/articles/puppies/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("POST 404 Responds with status 404 and not found when attempting to post a comment to an article id that doesnt exist", () => {
    const newComment = { body: "This is a comment", author: "icellusedkars" };
    return request(app)
      .post("/api/articles/200/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("article not found");
      });
  });
  test("POST 400 Responds with status 400 and bad request when a comment is posted in the incorrect format", () => {
    const newComment = {
      body: "This is a comment",
      author: 23,
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/comments/:comment_id", () => {
  test("DELETE 204 Responds with a status 204 and no content", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  test("DELETE 404 Responds with a status 404 and errror message when attempting to delete a comment that doesnt exist", () => {
    return request(app)
      .delete("/api/comments/20000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("comment not found");
      });
  });
  test("DELETE 400 Responds with a status 400 and errror message when attempting to delete a comment with an invalid id", () => {
    return request(app)
      .delete("/api/comments/puppies")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("PATCH 200 responds with the updated comment containing the increased vote count", () => {
    const patchComment = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/2")
      .send(patchComment)
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          votes: 15,
          author: "butter_bridge",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });
  test("PATCH 200 responds with the updated comment containing the decreased vote count", () => {
    const patchComment = { inc_votes: -1 };
    return request(app)
      .patch("/api/comments/2")
      .send(patchComment)
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toMatchObject({
          body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          votes: 13,
          author: "butter_bridge",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });
  test("PATCH 404 Responds with 404 and error message when passed a valid comment id thats not in the database", () => {
    const patchComment = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/2000")
      .send(patchComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("comment not found");
      });
  });
  test("PATCH 400 Responds with 400 and error message when passed an invalid comment id", () => {
    const patchComment = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/puppies")
      .send(patchComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("/api/users", () => {
  test("GET 200 Responds with an array of objects containing all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(4);
        users.forEach((user) => {
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
  test("GET 200 Responds with an object containing information on the requested user", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user).toEqual(
          expect.objectContaining({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          })
        );
      });
  });
  test("GET 404 Responds with a 404 and error message when trying to request a username that doesnt not exist in the database", () => {
    return request(app)
      .get("/api/users/puppies")
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});
