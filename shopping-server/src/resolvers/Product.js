
import { combineResolvers } from 'graphql-resolvers'
import moment from 'moment'

import { isPermissionDeleteProduct, isPermissionUpdateProduct, isAuthenticated, isAdminRole } from './Authorization'
import { getUserById, getConfirmUserById } from './Common'

const deleteProduct = async (parent, { id }, { models, currentUser }) => {
  const product = await models.product.deleteProduct(id, currentUser.id)
  return product
}

const getProducts = async (parent, { userId, filter, limit, nextToken }, { models }) => {
  const products = await models.product.getProducts({ filter, limit, nextToken, userId })
  return products
}

const getProductById = async (parent, { id }, { models }) => {
  const product = await models.product.getProductById(id)
  return product
}

const createProduct = async (parent, { input }, { models, currentUser }) => {
  console.log('input: ', input)
  const productInput = {
    ...input,
    userId: currentUser.id,
    datetime: moment().format()
  }
  const product = await models.product.putProduct(productInput)
  console.log('Product: ', product)
  return product
}

const updateProduct = async (parent, { input }, { models, currentUser }) => {
  const productInput = {
    ...input,
    userId: currentUser.id,
    datetime: moment().format()
  }
  const product = await models.product.putProduct(productInput)
  return product
}

const updateStatusProduct = async (parent, { id, status }, { models, currentUser }) => {
  const userId = currentUser.id
  const datetime = moment().format()
  const product = await models.product.updateStatusProduct({ id, status, datetime, userId })
  return product
}

export const getCategoryById = async (parent, args, { models }) => {
  if (parent.categoryId && parent.categoryId !== '0') {
    const category = await models.category.getCategoryById(parent.categoryId)
    return category
  }
}

export default {
  Query: {
    getProducts: combineResolvers(
      isAuthenticated,
      getProducts
    ),
    getProduct: combineResolvers(
      isAuthenticated,
      getProductById
    )
  },
  Mutation: {
    createProduct: combineResolvers(
      isAuthenticated,
      createProduct
    ),
    updateProduct: combineResolvers(
      isPermissionUpdateProduct,
      updateProduct
    ),
    updateStatusProduct: combineResolvers(
      isAdminRole,
      updateStatusProduct
    ),
    deleteProduct: combineResolvers(
      isPermissionDeleteProduct,
      deleteProduct
    )
  },
  Product: {
    userCreated: getUserById,
    userConfirm: getConfirmUserById,
    category: getCategoryById
  }
}
