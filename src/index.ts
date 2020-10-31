import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
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

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
  }
`);

// API endpoint

// Realtime Database に置き換える
// const fakeDatabase: any = {};

const database = firebaseDefault.database();

// const ref = path => firebase.database().ref(path)
// const getValue = path => ref(path).once('value')
// const mapSnapshotToEntities = snapshot => snapshot.val().map((value, id) => ({ id, ...value }))
// const getEntities = path => getValue(path).then(mapSnapshotToEntities)

// const resolvers = {
//     Author: {
//         posts(author) {
//             return getEntities('posts').then(posts => filter(posts, { authorId: author.id }))
//         },
//     },

//     Post: {
//         author(post) {
//             return getEntities('authors').then(posts => filter(authors, { id: authorId }))
//         },
//     },
// };

let fakeDatabase = {
  id: '',
  content: '',
  author: '',
};

const root = {
  getMessage: () => {
    return fakeDatabase;
  },
  createMessage: ({ input }: any) => {
    const id = Crypto.randomBytes(10).toString('hex');

    fakeDatabase = {
      id,
      content: input.content,
      author: input.author,
    };

    return fakeDatabase;
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
