import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

import Crypto from 'crypto';

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
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

// Message の class 実装

class Message {
  readonly id: string;
  readonly content: string;
  readonly author: string;

  constructor(
    id: string,
    { content, author }: { content: string; author: string }
  ) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

// API endpoint

const fakeDatabase: any = {};

type Input = {
  content: string;
  author: string;
};

const root = {
  getMessage: ({ id }: { id: string }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`no message exists with id ${id}`);
    }

    console.log(fakeDatabase);

    return new Message(id, fakeDatabase[id]);
  },
  createMessage: ({ input }: { input: Input }) => {
    const id = Crypto.randomBytes(10).toString('hex');

    fakeDatabase[id] = input;

    console.log(fakeDatabase);

    return new Message(id, input);
  },
  updateMessage: ({ id, input }: { id: string; input: Input }) => {
    if (!fakeDatabase[id]) {
      throw new Error(`no message exists with id ${id}`);
    }

    fakeDatabase[id] = input;

    console.log(fakeDatabase);

    return new Message(id, input);
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
