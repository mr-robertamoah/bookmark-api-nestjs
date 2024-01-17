<h1 align="center">Bookmark API</h1>

<p align="center">An Api that allows registered users to create, update, delete and get bookmarks.</p>

## Description

This is a [Nest](https://github.com/nestjs/nest) application. The following are some notable things the application uses:
- Postgres as database
- Prisma for creating models and migrating to database

## Installation

```bash
# install packages
$ npm install

# run docker container for postgres
$ npm run db:dev:restart

# generate types
$ npx prisma generate

# migrate models
$ npx prisma migrate dev
```

## Running the app

```bash
# development and its in watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# e2e tests
# it removes docker container if it exists, runs container, connect to database, run migrations and then performs the tests
$ npm run test:e2e
```
**Note:** you need to have docker installed because it uses a postgres docker container

## Endpoints

Authorization
- /auth/signup  POST  (for registering a user)  *returns object with access_token key*
- /auth/signin  POST  (for signing in a user)   *returns object with access_token key*
User Information **(bearer token required)**
- /user/me  GET    (getting user information)  *returns user object*
- /user  PATCH  (editing user information)  *returns user object*
Todo **(bearer token required)**
- /bookmarks      GET     (getting bookmarks of a user)  *returns array of bookmark*
- /bookmarks      POST    (create a bookmark)            *returns bookmark object*
- /bookmarks/:id  GET     (getting bookmarks of a user)  *returns bookmark object*
- /bookmarks/:id  PATCH   (edit bookmark object)         *returns bookmark object*
- /bookmarks/:id  DELETE  (edit bookmark object)         *returns bookmark object*

## Stay in touch

- GitHub - [Robert Amoah](https://github.com/mr-robertamoah)
- X - [@Mr_robertamoah](https://x.com/Mr_robertamoah)
- LinkedIn - [@Mr_robertamoah](https://www.linkedin.com/in/mr-robert-amoah)

## License

Nest is [MIT licensed](LICENSE).
