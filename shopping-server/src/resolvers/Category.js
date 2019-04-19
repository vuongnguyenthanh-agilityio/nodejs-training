
import { combineResolvers } from 'graphql-resolvers'
import moment from 'moment'

import { isPermissionModifyCategory, isAuthenticated } from './Authorization'
import { getUserById, getCategoryById as getCategoryId } from './Common'

const deleteCategory = async (parent, { id }, { models }) => {
  const category = await models.category.deleteCategory(id)
  return category
}

const getCategories = async (parent, { limit, nextToken }, { models }) => {
  const categories = await models.category.getCategories({ limit, nextToken })
  return categories
}

const getCategoryById = async (parent, { id }, { models }) => {
  const category = await models.category.getCategoryById(id)
  return category
}

const createCategory = async (parent, { input }, { models, currentUser }) => {
  const categoryInput = {
    ...input,
    userId: currentUser.id,
    datetime: moment().format()
  }
  const category = await models.category.putCategory(categoryInput)
  return category
}

const updateCategory = async (parent, { input }, { models, currentUser }) => {
  const categoryInput = {
    ...input,
    userId: currentUser.id,
    datetime: moment().format()
  }
  const category = await models.category.putCategory(categoryInput)
  return category
}

export default {
  Query: {
    getCategories: combineResolvers(
      isAuthenticated,
      getCategories
    ),
    getCategoryById: combineResolvers(
      isAuthenticated,
      getCategoryById
    )
  },
  Mutation: {
    createCategory: combineResolvers(
      isAuthenticated,
      createCategory
    ),
    updateCategory: combineResolvers(
      isPermissionModifyCategory,
      updateCategory
    ),
    deleteCategoryById: combineResolvers(
      isPermissionModifyCategory,
      deleteCategory
    )
  },
  Category: {
    user: getUserById,
    parent: getCategoryId
  }
}
