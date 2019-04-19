import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    getUsers(filter: FilterUserInput, limit: Int, nextToken: String): Users
    getUserById(id: ID!): User
  }

  extend type Mutation {
    signUp(input: SignUpUserInput!): Token!
    signIn(username: String!, password: String!): Token!
    createUser(input: CreateUserInput!): User!
    deleteUser(id: ID!): User!
  }

  type Token {
    user: User
    token: String!
  }

  enum Role {
    ADMIN
    CUSTOMER
  }

  type Users {
    count: Int
    nextToken: String
    users: [User!]
  }

  type User {
    id: ID!
    username: String!
    role: Role!
    name: String
    phone: String
    address: String
    createdAt: String
    photos: [String!]
  }

  input FilterUserInput {
    role: Role
  }

  input SignUpUserInput {
    username: String!
    name: String!
    phone: String!
    password: String!
    role: Role
    address: String
  }

  input CreateUserInput {
    username: String!
    password: String!
    role: Role!
  }
`
