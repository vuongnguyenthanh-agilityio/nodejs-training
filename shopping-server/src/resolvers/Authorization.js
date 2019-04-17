import { ForbiddenError } from 'apollo-server'
import { skip, combineResolvers } from 'graphql-resolvers'

export const isAuthenticated = (parent, args, { currentUser }) => {
  if (!currentUser || currentUser.ait === 'Invalid Date') {
    throw new ForbiddenError('Not authenticated as user.')
  }
  return skip
}

export const isAdminRole = combineResolvers(
  isAuthenticated,
  (parent, args, { currentUser: { role } }) => {
    if (role !== 'ADMIN') {
      throw new ForbiddenError('Not authorized as admin.')
    }
    return skip
  }
)

export const isPermissionDeleteUser = combineResolvers(
  isAuthenticated,
  (parent, { id }, { models, currentUser: { role, id: userId } }) => {
    if (role !== 'ADMIN' || userId !== id) {
      throw new ForbiddenError('No permission.')
    }
    return skip
  }
)
