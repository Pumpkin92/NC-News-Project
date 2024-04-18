# Northcoders News API

The purpose of this API is to access application data programmatically. This is mimicing the building of a real world backend service (similar to reddit). NC News contains articles containing a body, author, topic, votes, and comment count, along with the date it was created.

The technology stack used:

- Node.js
- PostgreSQL
- Express.js
- pg
- pg format
- Jest
- Supertest
  The minimum version of node required is: v21.5.0 and postgres 16.2

The hosted version of the API can be accessed via https://nc-news-project-q2e5.onrender.com/api
All available endpoints can be found at this link.

if you would like to run this server locally please begin by cloning the repo on gitrhub and setting up a repository.
git clone https://github.com/Pumpkin92/NC-News-Project.git

To set up the database correctly you'll need the following commands:

- npm i (this will install all the dependancies required for the project)
- npm run setup-dbs - to set up the database
- npm run seed - to seed the database
- npm run test - to run the testing suite
- npm run prepare - to install Husky

To ensure the databse is kept secure, two .env files will need to be set up with the database name. These files are git ignored, to ensure the safety of the database.
For the purposes of accessing this repo the env database names are 'nc_news_test' and 'nc_news'
These files should be called .env.test for the testing database and .env.development for the development database. The follow the same structure as the .env-example file
