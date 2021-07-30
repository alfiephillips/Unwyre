import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
  }

  type Query {
    me: User
  }
  type Mutation {
    register(email: String!, password: String!): User
    login(email: String!, password: String!): User
    logout: Boolean!
  }
`;

export default typeDefs;
