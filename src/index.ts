import express, { Request, Response, NextFunction } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

// GraphQL schema
// 埋め込みの GraphQL Schema をヒントするには #graphql を記述する

const schema = buildSchema(`#graphql
  type Query {
    ip: String
  }
`);

// Middleware

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next();
};

// API endpoint

const root = {
  ip: (args: any, request: Request) => {
    return request.ip;
  },
};

// express

const app = express();
const port = 4000;

app.use(loggingMiddleware);

app.use(
  '/',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
