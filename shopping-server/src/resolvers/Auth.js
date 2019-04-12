import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { AuthenticationError, UserInputError } from 'apollo-server'

/**
* Create token with userId, username and role
* @param {object} user
* @param {string} secret
* @param {string} expiresIn
* @return {string} json web token
*/
const createToken = async (user, secret, expiresIn) => {
  const { id, role, username } = user
  const token = await jwt.sign({ id, role, username }, secret, {
    expiresIn
  })
  return token
}

/**
* register a user to database
* @param {object} parent
* @param {object} agr
* @param {object} context
* @return {object}
*/
const registerUser = async (parent, { input }, { models, secret }) => {
  const user = await models.user.createUser(input)
  const token = createToken(user, secret, '30m')
  return {
    token,
    user
  }
}

/**
* register a user to database
* @param {object} parent
* @param {object} agr
* @param {object} context
* @return {object}
*/
const signIn = async (parent, { username, password }, { models, secret }) => {
  const res = await models.user.getUserByUsername(username)
  const users = res && res.Items ? res && res.Items : []
  if (users.length === 0) {
    throw new UserInputError('No user found with this login credentials.')
  }

  // Check validate passowrd
  console.log('User: ', users)
  // const bcryptPassword =
  const isValid = await bcrypt.compare(password, users[0].password)
  if (!isValid) {
    throw new AuthenticationError('Invalid password.')
  }
  const token = createToken(users[0], secret, '30m')
  return {
    token
  }
}

export default {
  Query: {
    me: () => {
      return {
        id: '123',
        username: 'vuong@gmail.com',
        name: 'vuong',
        password: '123',
        role: 'ADMIN'
      }
    }
  },

  Mutation: {
    signUp: registerUser,
    signIn: signIn
  }
}
