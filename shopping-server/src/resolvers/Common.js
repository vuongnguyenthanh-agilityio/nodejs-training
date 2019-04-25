
export const getUserById = async (parent, args, { loaders }) => {
  if (parent.createdBy) {
    const user = await loaders.user.load(parent.createdBy)
    return user
  }
}

export const getConfirmUserById = async (parent, args, { loaders }) => {
  if (parent.confirmedBy) {
    const user = await loaders.user.load(parent.confirmedBy)
    return user
  }
}

export const getCategoryById = async (parent, args, { models }) => {
  if (parent.parentId && parent.parentId !== '0') {
    const category = await models.category.getCategoryById(parent.parentId)
    return category
  }
}
