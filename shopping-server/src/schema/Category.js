import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    getCategories(filter: FilterCategoryInput, limit : Int = 10, nextToken: String): Categories
    getCategoryById(id: ID!): Category
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(input: UpdateCategoryInput!): Category!
    deleteCategoryById(id: ID!): Category!
  }

  type Category {
    id: ID!
    name: String!
    parent: Category
    description: String
    user: User
    datetime: String
  }

  type Categories {
    count: Int
    nextToken: String
    categories: [Category]
  }

  input UpdateCategoryInput {
    id: ID!
    name: String
    parentId: String
    description: String
  }

  input CreateCategoryInput {
    name: String!
    parentId: String
    description: String
  }

  input FilterCategoryInput {
    datetime: String
    parentId: String
    user: FilterCategoryUserInput
  }

  input FilterCategoryUserInput {
    id: ID
    role: String
  }
`
