import { gql } from 'apollo-server-express'

import userSchema from './User'
import CategorySchema from './Category'

const linkSchema = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`

export default [linkSchema, userSchema, CategorySchema]
