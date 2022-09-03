# Flybondi App - [flybondi.vercel.app/](https://flybondi.vercel.app/)

[![Conventional Commits](https://img.shields.io/badge/Husky-Eslint--Prettier-red)](https://typicode.github.io/husky/#/)

## How to run the project

To install all of the project dependencies run:

`npm i`

To run the project run:

`npm start`

To run in the development environment you must add an .env file that must contain:

- `ENV` should be 'development'
- `DEV_DB_USER` data base user
- `DEV_DB_PASSWORD` password for the data base
- `DEV_DB_HOST` should be 'localhost'
- `DEV_DB_NAME` name for the data base
- `DEV_URL_DATABASE` postgres://`DEV_DB_USER`:`DEV_DB_PASSWORD`@`DEV_DB_HOST`/`DEV_DB_NAME`
- `PORT` port for run api server
- `SESSION_SECRET1` for encrypt session
- `SESSION_SECRET2` for encrypt session
- `API_URL_DEV` api url
- `X_API_KEY_WEB` same of client enviroment
- `CLIENT_URL` client url

Also you shold run client app [CLIENT](https://github.com/GuillermoAmbroggio/flybondi)

## Deployment

The project gets automatically deployed through an [Heroku github integration](https://devcenter.heroku.com/articles/github-integration) once it reaches either the `master` branch.

You can visit the deployed project at:

- [flybondi-api.herokuapp.com/](https://flybondi-api.herokuapp.com/)
