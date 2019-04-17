
import { UserInputError } from 'apollo-server'
import { combineResolvers } from 'graphql-resolvers'
import { isPermissionDeleteUser, isAdminRole, isAuthenticated } from './Authorization'

const deleteUser = async (parent, { id }, { models }) => {
  // Check valid some attribute that requires input
  if (!id) {
    throw new UserInputError('Form input invalid', { id })
  }
  const user = await models.user.deleteUser(id)
  return user
}

const getUsers = async (parent, args, { models }) => {
  const users = await models.user.getUsers()
  return users
}

const getUsersByRole = async (parent, { role }, { models }) => {
  const users = await models.user.getUsersByRole(role)
  return users
}

const getUserById = async (parent, { id }, { models }) => {
  const user = await models.user.getUserById(id)
  return user
}

export default {
  Query: {
    getUsers: combineResolvers(
      isAdminRole,
      getUsers
    ),
    getUsersByRole: combineResolvers(
      isAdminRole,
      getUsersByRole
    ),
    getUserById: combineResolvers(
      isAuthenticated,
      getUserById
    )
  },
  Mutation: {
    deleteUser: combineResolvers(
      isPermissionDeleteUser,
      deleteUser
    )
  }
}
