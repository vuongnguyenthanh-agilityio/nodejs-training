import { ForbiddenError } from 'apollo-server'
import { skip, combineResolvers } from 'graphql-resolvers'

export const isAuthenticated = (parent, args, { currentUser }) => {
  if (!currentUser) {
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
  (parent, { id }, { currentUser: { role, id: userId } }) => {
    if (role !== 'ADMIN' || userId !== id) {
      throw new ForbiddenError('No permission.')
    }
    return skip
  }
)

export const isPermissionModifyCategory = combineResolvers(
  isAuthenticated,
  async (parent, { id, input }, { models, currentUser: { role, id: userId } }) => {
    const categoryId = (input && input.id) ? input.id : id
    const category = await models.category.getCategoryById(categoryId)
    if (role !== 'ADMIN' && (category && userId !== category.createdBy)) {
      throw new ForbiddenError('No permission.')
    }
    return skip
  }
)

export const isPermissionDeleteProduct = combineResolvers(
  isAuthenticated,
  async (parent, { id, input }, { models, currentUser: { role, id: userId } }) => {
    // const categoryId = (input && input.id) ? input.id : id
    const product = await models.product.getProductById(id)
    if (role !== 'ADMIN' && (product && userId !== product.createdBy)) {
      throw new ForbiddenError('No permission.')
    }
    return skip
  }
)

export const isPermissionUpdateProduct = combineResolvers(
  isAuthenticated,
  async (parent, { id, input }, { models, currentUser: { role, id: userId } }) => {
    const product = await models.product.getProductById(input.id)
    if (product && userId !== product.createdBy) {
      throw new ForbiddenError('No permission.')
    }
    return skip
  }
)
