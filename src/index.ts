import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import { Message, MessageInput, QueryReadMessageArgs } from './types/graphql';
import Crypto from 'crypto';
import * as firebase from 'firebase/app';

import 'firebase/database';

// firebase settings

const firebaseConfig = {
  apiKey: 'AIzaSyB7k3FvoggUpNRl9NYeV4ACMedbMY3fXw4',
  authDomain: 'test-realtime-database-2809f.firebaseapp.com',
  databaseURL: 'https://test-realtime-database-2809f.firebaseio.com',
  storageBucket: 'test-realtime-database-2809f.appspot.com',
};

// wip default を入れないと initializeApp 等のメソッドが存在しない
const firebaseDefault = firebase.default;
firebaseDefault.initializeApp(firebaseConfig);

// GraphQL schema
// 埋め込みの GraphQL Schema をヒントするには #graphql を記述する

const schema = buildSchema(`#graphql
  input MessageInput {
    content: String
    author: String
  }

  input MessageUpdate {
    id: ID!
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    message(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(input: MessageUpdate): Message
    deleteMessage(id: ID!): ID
  }
`);

// API endpoint

const database = firebaseDefault.database();
const databaseRef = (id: string) => database.ref(`posts/${id}`);

// method name は Query, Mutation と同一の名前にする

const root = {
  createMessage: ({ input }: { input: MessageInput }) => {
    const id = Crypto.randomBytes(10).toString('hex');

    databaseRef(id).set({
      content: input.content,
      author: input.author,
    });

    return databaseRef(id)
      .once('value')
      .then((snapshot) => {
        return snapshot.val();
      });
  },
  message: ({ id }: QueryReadMessageArgs) => {
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
  deleteMessage: ({ id }: QueryReadMessageArgs) => {
    return databaseRef(id)
      .remove()
      .then((_) => {
        return id;
      });
  },
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
