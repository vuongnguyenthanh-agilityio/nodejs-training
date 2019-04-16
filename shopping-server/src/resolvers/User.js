
import { AuthenticationError, UserInputError } from 'apollo-server'

const deleteUser = async (parent, { id }, { models }) => {
  // Check valid some attribute that requires input
  if (!id) {
    throw new UserInputError('Form input invalid', { id })
  }
  const user = await models.user.deleteUser(id)
  return user
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
    deleteUser: deleteUser
  }
}
