import { buildSchema } from 'graphql';

// GraphQL schema
// 埋め込みの GraphQL Schema をヒントするには #graphql を記述する

export default buildSchema(`#graphql
  type Message {
    id: ID
    content: String
    author: String
  }

  type Query {
    message(id: ID!): Message
  }
`);
