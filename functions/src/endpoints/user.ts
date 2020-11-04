import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { QueryMessageArgs } from '../types/graphql';
import schema from '../schema';

import databaseRef from './databaseRef';

const rootUser = {
  message: ({ id }: QueryMessageArgs) => {
    return databaseRef(id)
      .once('value')
      .then((snapshot) => {
        return snapshot.val();
      });
  },
};

const appUser = express();

export default appUser.use(
  '/',
  graphqlHTTP({
    schema,
    rootValue: rootUser,
    graphiql: true,
  })
);
