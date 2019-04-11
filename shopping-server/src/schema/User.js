import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    getUsers: [User!]
    getUsersbyRole(role: String!): [User!]
    getUserById(id: ID!): User
  }

  extend type Mutation {
    signUp(input: CreateUserInput): Token!
    signIn(login: String!, password: String!): Token!
    deleteUser(id: ID!): Boolean!
  }

  type Token {
    user: User
    token: String!
  }

  type User {
    id: ID!
    username: String!
    name: String!
    phone: Int!
    role: String!
    address: String
    photos: [String!]
  }

  type CreateUserInput {
    username: String!
    name: String!
    phone: Int!
    role: String!
    password: String!
    address: String
  }
`
