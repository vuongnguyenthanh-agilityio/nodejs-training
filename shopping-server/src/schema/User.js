import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    getUsers: [User!]
    getUsersByRole(role: String!): [User!]
    getUserById(id: ID!): User
  }

  extend type Mutation {
    signUp(input: CreateUserInput!): Token!
    signIn(username: String!, password: String!): Token!
    deleteUser(id: ID!): User!
  }

  type Token {
    user: User
    token: String!
  }

  type User {
    id: ID!
    username: String!
    role: String!
    name: String
    phone: String
    address: String
    photos: [String!]
  }

  input CreateUserInput {
    username: String!
    name: String!
    phone: String!
    role: String!
    password: String!
    address: String
  }
`
