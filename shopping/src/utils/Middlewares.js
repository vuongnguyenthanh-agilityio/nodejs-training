import bodyParser from 'body-parser'
import express from 'express'

module.exports = app => {
  app.set('json spaces', 2)
  // Configure bodyparser to handle post requests
  app.use(bodyParser.urlencoded({
    extended: true
  }))
  app.use(bodyParser.json())
  app.use(app.utils.Authentication.initialize())
  app.use(express.static('public'))
  app.use((req, res, next) => {
    delete req.body.id
    next()
  })
}
