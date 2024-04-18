# Northcoders News API

The purpose of this API is to access application data programmatically. This is mimicing the building of a real world backend service (similar to reddit). NC News contains articles containing a body, author, topic, votes, and comment count, along with the date it was created.

Available Endpoints:
GET /api - serves all the available endpoints of the api
GET /api/topics - serves an array of all topics
GET /api/articles - serves an array of all articles
GET /api/articles/:article_id - serves an object containing the requested article
PATCH /api/articles/:article_id - Updates content on the requested article
GET /api/articles/:arrticle_id/comments - serves an array of all comments associated with the requested article
POST /api/articles/:article_id/comments - Adds a new comment to the requested article
DELETE /api/comments/comment_id - Deletes the comment by the comment id
GET /api/users - serves an array of all users

The technology stack used:
Node.js
PostgreSQL
Express.js
pg
pg format
Jest
Supertest
The minimum version of node required is: v21.5.0 and postgres 16.2

The hosted version of the API can be accessed via https://nc-news-project-q2e5.onrender.com/api

if you would like to try this database for yourself please begin by cloning the repo on gitrhub and setting up a repository.
git clone https://github.com/Pumpkin92/NC-News-Project.git

To set up the database correctly you'll need the following commands:

- npm i (this will install all the dependancies required for the project)

- npm run...
  setup-dbs - to set up the database
  seed - to seed the database
  test - to run the testing suite
  prepare - to install Husky

To ensure the databse is kept secure, two .env files will need to be set up with the database name. These files are git ignored, to ensure the safety of the database.
These files should be called .env.test for the testing database and .env.development for the development database. The follow the same structure as the .env-example file
