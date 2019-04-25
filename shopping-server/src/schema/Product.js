import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    getProducts(filter: FilterProductInput, limit : Int, nextToken: String): Products
    getProduct(id: ID!): Product!
  }

  extend type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(input: UpdateProductInput!): Product!
    updateStatusProduct(id: ID!, status: Status!): Product!
    deleteProduct(id: ID!): Product!
  }

  type Product {
    id: ID!
    category: Category!
    name: String!
    price: Int
    amount: Int
    discount: Int
    photos: [String!]
    description: String
    status: Status
    createdBy: User
    confirmedBy: User
    createdAt: String
    confirmedAt: String
  }

  enum Status {
    PENDING
    REJECT
    APPROVE
  }

  type Products {
    count: Int
    nextToken: String
    products: [Product!]
  }

  input UpdateProductInput {
    id: ID!
    categoryId: String!
    name: String!
    price: Int
    amount: Int
    discount: Int
    photos: [String!]
    description: String
    status: Status
  }

  input CreateProductInput {
    categoryId: String!
    name: String!
    price: Int
    amount: Int
    discount: Int
    photos: [String!]
    description: String
    status: Status = PENDING
  }

  input FilterProductInput {
    categoryId: String
    status: String
  }

`
