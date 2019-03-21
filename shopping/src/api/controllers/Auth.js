const bcrypt = require('bcrypt')
const jwt = require('jwt-simple')
const jwtConfig = require('../../config/PassportJwt.js')

const userModel = require('../models/Users.js')

exports.register = (req, res) => {
  const { body: { companyId, name, username, password, photos } } = req

  if (!companyId) {
    res.status(400).json({
      errorCode: 200,
      message: 'Valid companyId'
    })
  }

  const salt = bcrypt.genSaltSync()
  const bcryptPassword = bcrypt.hashSync(password, salt)

  const user = {
    companyId,
    name,
    username,
    photos,
    password: bcryptPassword
  }

  userModel.createUser(user, (error, data) => {
    if (error) {
      res.status(304).json({
        errorCode: 300,
        message: error
      })
    } else {
      res.status(201).json({
        message: 'Create User successfully'
      })
    }
  })
}

exports.login = (req, res) => {
  const { body: { username, password } } = req
  userModel.getUserByUsername(username, (error, data) => {
    if (error) {
      res.status(500).json({
        errorCode: 300,
        message: error
      })
    } else {
      const { Items: [ user ] } = data
      if (bcrypt.compareSync(password, user.password)) {
        const payload = { id: user.id, username: user.username }
        res.status(200).json({
          token: jwt.encode(payload, jwtConfig.jwtSecret)
        })
      } else {
        res.status(401).json({
          errorCode: 100,
          message: 'Incorrect password'
        })
      }
    }
  })
}
