import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import DataLoader from 'dataloader'

import schema from './schema'
import models from './models'
import resolvers from './resolvers'
import loaders from './loaders'
import { verifyToken } from './utils/Utilties'

process.title = 'myApp'

const app = express()
app.use(cors())

const getCurrentUser = async req => {
  const token = req.headers['x-token']

  if (token) {
    try {
      return await verifyToken(token, process.env.SECRET)
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.')
    }
  }
}

// creating the server
const server = new ApolloServer({

  // passing types and resolvers to the server
  typeDefs: schema,
  resolvers,

  context: async ({ req }) => {
    const currentUser = await getCurrentUser(req)
    return {
      currentUser,
      models,
      secret: process.env.SECRET,
      loaders: {
        user: new DataLoader(keys =>
          loaders.user.batchUsers(keys, models)
        )
      }
    }
  }
})

server.applyMiddleware({ app, path: '/graphql' })

const serverApp = app.listen({ port: 9000 }, () => {
  console.log('Apollo Server on http://localhost:9000/graphql')
})

export default serverApp
