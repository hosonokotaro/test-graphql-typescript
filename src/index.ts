import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLObjectType, GraphQLString, GraphQLSchema } from 'graphql';

// BuildSchema を使用しない場合

const fakeDatabase: any = {
  a: {
    id: 'a',
    name: 'yamada',
  },
  b: {
    id: 'b',
    name: 'suzuki',
  },
};

// User type を定義する

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
  },
});

// Query type を定義する

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      args: {
        id: { type: GraphQLString },
      },
      resolve: (_, { id }) => {
        console.log(id);
        return fakeDatabase[id];
      },
    },
  },
});

// Schema を作成する

const schema = new GraphQLSchema({ query: queryType });

// express

const app = express();
const port = 4000;

app.use(
  '/',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
