import cors from 'cors'
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'

import schema from './schema'
import userModel from './models/User'

const app = express()
app.use(cors())

const resolvers = {
  Query: {
    me: () => {
      return {
        username: 'VuongNguyen'
      }
    }
  }
}

// creating the server
const server = new ApolloServer({

  // passing types and resolvers to the server
  typeDefs: schema,
  resolvers,

  // initial context state, will be available in resolvers
  context: () => ({}),

  // an object that goes to the "context" argument
  // when executing resolvers
  models: () => {
    return {
      userModel
    }
  }
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen({ port: 9000 }, () => {
  console.log('Apollo Server on http://localhost:9000/graphql')
})
