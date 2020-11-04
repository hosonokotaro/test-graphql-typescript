import { buildSchema } from 'graphql';

// GraphQL schema
// 埋め込みの GraphQL Schema をヒントするには #graphql を記述する

export default buildSchema(`#graphql
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
