const bcrypt = require('bcrypt')
const jwt = require('jwt-simple')
const jwtConfig = require('../../config/PassportJwt.js')

const userModel = require('../models/Users.js')

exports.regiter = (req, res) => {
  console.log('reqbody: ', req.body)

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
      console.log('Error: ', error)
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
  console.log('req.body: ', req.body)
  console.log('req.params: ', req.params)
  const { body: { username, password } } = req
  userModel.getUserByUsername(username, (error, data) => {
    if (error) {
      console.log('Error: ', error)
      res.status(500).json({
        errorCode: 300,
        message: error
      })
    } else {
      console.log('Data: ', data)
      if (bcrypt.compareSync(data.password, password)) {
        const payload = { id: data.id, username: data.username }
        res.status(200).json({
          token: jwt.encode(payload, jwtConfig.jwtSecret),
          user: data
        })
      } else {
        res.sendStatus(401)
      }
    }
  })
}
