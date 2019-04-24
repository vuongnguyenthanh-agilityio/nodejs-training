
import { combineResolvers } from 'graphql-resolvers'
import { isPermissionDeleteUser, isAdminRole, isAuthenticated } from './Authorization'

const deleteUser = async (parent, { id }, { models }) => {
  const user = await models.user.deleteUser(id)
  return user
}

const getUsers = async (parent, { filter, limit, nextToken }, { models }) => {
  const users = await models.user.getUsers({ filter, limit, nextToken })
  return users
}

const getUserById = async (parent, { id }, { models }) => {
  const user = await models.user.getUserById(id)
  return user
}

/**
* register a user to database
* @param {object} parent
* @param {object} agr
* @param {object} context
* @return {object}
*/
const createUser = async (parent, { input }, { models, secret }) => {
  const user = await models.user.createUser(input)
  return user
}

export default {
  Query: {
    getUsers: combineResolvers(
      isAdminRole,
      getUsers
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
    ),
    createUser: combineResolvers(
      isAdminRole,
      createUser
    )
  }
}
