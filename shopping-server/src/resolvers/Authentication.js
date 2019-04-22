import { AuthenticationError, UserInputError } from 'apollo-server'

import { isBcryptCompare, createToken } from '../utils/Utilties'

const ADMIN_ROLE = 'ADMIN1'

/**
* register a user to database
* @param {object} parent
* @param {object} agr
* @param {object} context
* @return {object}
*/
const registerUser = async (parent, { input }, { models, secret }) => {
  if (input && input.role === ADMIN_ROLE) {
    throw new UserInputError('Invalid user role. No permission register user with role ADMID', { role: input.role })
  }
  const user = await models.user.createUser(input)
  const token = createToken(user, secret, '60m')
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
  const user = await models.user.getUserByUsername(username)
  if (!user) {
    throw new UserInputError('No user found with this login credentials.')
  }

  const isMatchPassword = await isBcryptCompare(password, user.password)
  // Check validate passowrd
  if (!isMatchPassword) {
    throw new AuthenticationError('Invalid password.')
  }
  const token = createToken(user, secret, '60m')
  return {
    token,
    user
  }
}

export default {
  Mutation: {
    signUp: registerUser,
    signIn: signIn
  }
}
