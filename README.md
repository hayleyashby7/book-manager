# 📖 Minimalist Book Manager API

## Introduction

This is the starter repository for the Further APIs session. It provides a start to creating a Minimalist Book Manager API.
Cloned from https://github.com/techreturners/lm-code-book-manager-api-ts

### Pre-Requisites

-   NodeJS installed (v18.12.1 Long Term Support version at time of writing)

### Technologies & Dependencies

-   [TypeScript](https://www.typescriptlang.org/)
-   [ExpressJS](https://expressjs.com/)
-   [Sequelize](https://sequelize.org/)
-   [SQLite3](https://www.npmjs.com/package/sqlite3)
-   [Jest](https://jestjs.io/)
-   [Supertest](https://www.npmjs.com/package/supertest)
-   [ESLint](https://eslint.org/)

### How to Get Started

-   Fork this repo to your Github and then clone the forked version of this repo

### Running the application

In order to run the unit tests run, firstly install the dependencies (if you haven't already done so)

```
npm install
```

Followed by:

```
npm start
```

### Running the Unit Tests

In order to run the unit tests run, firstly install the dependencies (if you haven't already done so)

```
npm install
```

Followed by:

```
npm test
```

### Tasks

Here are some tasks for you to work on:

📘 Task 1: Implement the following User Story with tests.

`User Story: As a user, I want to use the Book Manager API to delete a book using its ID`

📘 Extension Task: Oh no! 😭 We've only covered the happy paths in the solution, can you figure out a way
to add in exception handling to the project?

-   Clue 1: What if someone wants to add a book with an ID for a book that already exists? How do we handle this gracefully?

-   Clue 2: What if someone wants to find a book by an ID that doesn't yet exist?
    How can we improve the API by handling errors gracefully and show a helpful message to the client?
