import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import compression from 'compression'
import helmet from 'helmet'

import logger from './Logger.js'

module.exports = app => {
  app.set('port', 3000)
  app.set('json spaces', 2)
  // Configure bodyparser to handle post requests
  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(bodyParser.json())
  app.use(cors({
    origin: ['http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }))
  app.use(morgan('common', {
    stream: {
      write: (message) => {
        logger.info(message)
      }
    }
  }))
  app.use(compression())
  // app.use(helmet())
  app.use(app.utils.Authentication.initialize())
  app.use(express.static('public'))
  app.use((req, res, next) => {
    delete req.body.id
    next()
  })
}
