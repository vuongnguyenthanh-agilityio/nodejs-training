import jwt from 'jsonwebtoken'
import { AuthenticationError, UserInputError, ApolloError } from 'apollo-server'

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username } = user
  const token = await jwt.sign({ id, email, username }, secret, {
    expiresIn
  })
  return token
}

const registerUser = async (parent, { input }, { models, secret }) => {
  const user = await models.user.createUser(input)
  const token = createToken(user, secret, '30m')
  return {
    token,
    user
  }
}

const signIn = async (parent, { username, password }, { models, secret }) => {
  const res = await models.user.getUserByUsername(username)
  const users = res && res.Items ? res && res.Items : []
  if (users.length === 0) {
    throw new AuthenticationError('User not exists ')
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
