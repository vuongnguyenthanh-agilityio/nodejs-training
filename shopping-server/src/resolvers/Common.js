
export const getUserById = async (parent, args, { models }) => {
  if (parent.createdBy) {
    const user = await models.user.getUserById(parent.createdBy)
    return user
  }
}

export const getCategoryById = async (parent, args, { models }) => {
  if (parent.parentId && parent.parentId !== '0') {
    const category = await models.category.getCategoryById(parent.parentId)
    return category
  }
}
