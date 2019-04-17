
import { UserInputError } from 'apollo-server'
import { combineResolvers } from 'graphql-resolvers'
import { isPermissionDeleteUser } from './Authorization'

const deleteUser = async (parent, { id }, { models }) => {
  // Check valid some attribute that requires input
  if (!id) {
    throw new UserInputError('Form input invalid', { id })
  }
  const user = await models.user.deleteUser(id)
  return user
}

export default {
  Mutation: {
    deleteUser: combineResolvers(
      isPermissionDeleteUser,
      deleteUser
    )
  }
}
