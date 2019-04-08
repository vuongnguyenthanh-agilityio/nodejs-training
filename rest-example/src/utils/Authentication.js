import logger from './Logger.js'
const passport = require('passport')
const { Strategy, ExtractJwt } = require('passport-jwt')

const userModel = require('../api/models/Users.js')
const jwtConfig = require('../config/PassportJwt.js')

module.exports = app => {
  const params = {
    secretOrKey: jwtConfig.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer')
  }

  const strategy = new Strategy(params, (payload, done) => {
    console.log('payload: ', payload)
    userModel.getUserById(payload.id, (error, data) => {
      console.log('Error: ', error)
      logger.info('Authecation: Get User ID ', error)
      if (error) {
        return done(null, false)
      }
      const { Items: [ user ] } = data
      return done(null, {
        id: user.id,
        username: user.username
      })
    })
  })

  passport.use(strategy)

  return {
    initialize: () => {
      return passport.initialize()
    },
    authenticate: () => {
      return passport.authenticate('jwt', jwtConfig.jwtSession)
    }
  }
}
