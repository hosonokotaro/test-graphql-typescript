import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

// GraphQL schema

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// API endpoint

const root = {
  hello: () => 'hello GraphQL!',
};

// express

const app = express();
const port = 4000;

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
