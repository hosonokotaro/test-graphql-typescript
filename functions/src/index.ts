import * as functions from 'firebase-functions';
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { Message, MessageInput, QueryMessageArgs } from './types/graphql';
import Crypto from 'crypto';
import * as firebase from 'firebase/app';
import schema from './schema';
import firebaseConfig from './firebaseConfig';

import 'firebase/database';

// firebase settings

// wip default を入れないと initializeApp 等のメソッドが存在しない
const firebaseDefault = firebase.default;
firebaseDefault.initializeApp(firebaseConfig);

const databaseRef = (id: string) =>
  firebaseDefault.database().ref(`posts/${id}`);

// API endpoint
// method name は Query, Mutation と同一の名前にする

const root = {
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

// express

const app = express();

app.use(
  '/',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

export const api = functions.region('asia-northeast1').https.onRequest(app);
