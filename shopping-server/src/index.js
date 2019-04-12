import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'

import schema from './schema'
import models from './models'
import resolvers from './resolvers'

process.title = 'myApp'

const app = express()
app.use(cors())

// creating the server
const server = new ApolloServer({

  // passing types and resolvers to the server
  typeDefs: schema,
  resolvers,

  context: async () => ({
    models,
    secret: process.env.SECRET
  })
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen({ port: 9000 }, () => {
  console.log('Apollo Server on http://localhost:9000/graphql')
})
