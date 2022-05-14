# Todo

This is the server for Todo, a project management system. It is similar in functionality to Jira or Trello. It allows users to create projects and tickets and assign them to any users apart of the project. Additionally, Todo supports functionality for a fully customizable Kanban board. The server was written in Node.JS using NestJS, a progressive framework written in TypeScript. Todo stores user content in an AWS S3 bucket and stores user data in a MySQL database in AWS RDS. While the frontend is currently ongoing completion, the server is almost entirely complete. 

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Frontend Repo Link
https://github.com/jlomonacouf/TodoWebApp
