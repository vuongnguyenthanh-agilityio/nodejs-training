
import { combineResolvers } from 'graphql-resolvers'
import moment from 'moment'

import { isPermissionModifyCategory, isAdminRole, isAuthenticated } from './Authorization'
import { getUserById, getCategoryById as getCategoryId } from './Common'

const deleteCategory = async (parent, { id }, { models }) => {
  const category = await models.category.deleteCategory(id)
  return category
}

const getCategories = async (parent, { filter }, { models }) => {
  const categories = await models.category.getCategories(filter)
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
  const category = await models.category.createCategory(categoryInput)
  return category
}

const updateCategory = async (parent, { input }, { models, currentUser }) => {
  const categoryInput = {
    ...input,
    userId: currentUser.id,
    datetime: moment().format()
  }
  const category = await models.category.updateCategory(categoryInput)
  return category
}

export default {
  Query: {
    getCategories: combineResolvers(
      isAdminRole,
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
