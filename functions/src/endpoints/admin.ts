import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { Message, MessageInput, QueryMessageArgs } from '../types/graphql';
import Crypto from 'crypto';
import schema from '../schema/adminSchema';

import databaseRef from './databaseRef';

const rootAdmin = {
  createMessage: ({ input }: { input: MessageInput }) => {
    const id = Crypto.randomBytes(10).toString('hex');

    databaseRef(id)
      .set({
        content: input.content,
        author: input.author,
      })
      .catch((error) => {
        throw new Error(error);
      });

    return databaseRef(id)
      .once('value')
      .then((snapshot) => {
        return snapshot.val();
      });
  },
  message: ({ id }: QueryMessageArgs) => {
    return databaseRef(id)
      .once('value')
      .then((snapshot) => {
        return snapshot.val();
      });
  },
  updateMessage: ({ input }: { input: Message }) => {
    return databaseRef(input.id)
      .update({
        content: input.content,
        author: input.author,
      })
      .then((_) => {
        return input;
      });
  },
  deleteMessage: ({ id }: QueryMessageArgs) => {
    return databaseRef(id)
      .remove()
      .then((_) => {
        return id;
      });
  },
};

const appAdmin = express();

export default appAdmin.use(
  '/',
  graphqlHTTP({
    schema,
    rootValue: rootAdmin,
    graphiql: true,
  })
);
