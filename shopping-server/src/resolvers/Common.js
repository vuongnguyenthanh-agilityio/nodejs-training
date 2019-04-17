
export const getUserById = async (parent, args, { models }) => {
  const user = await models.user.getUserById(parent.createdBy)
  return user
}

export const getCategoryById = async (parent, args, { models }) => {
  const category = await models.category.getCategoryById(parent.parentId)
  console.log('category: ', category)
  return category
}
