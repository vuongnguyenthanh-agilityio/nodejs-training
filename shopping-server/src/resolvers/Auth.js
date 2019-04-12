import jwt from 'jsonwebtoken'

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username } = user
  const token = await jwt.sign({ id, email, username }, secret, {
    expiresIn
  })
  console.log('Token: ', token)
  return token
}

const registerUser = async (parent, { input }, { models, secret }) => {
  const user = await models.user.createUser(input)
  console.log('user: ', user)
  const token = createToken(user, secret, '30m')
  return {
    token,
    user
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
    signUp: registerUser
  }
}
