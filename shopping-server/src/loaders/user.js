/**
* Get all user for use Dataloader
* @param {Array} keys
* @param {object} models
* @return {string} string base64
*/
export const batchUsers = async (keys, models) => {
  const data = await models.user.getUsers({})
  const users = data && data.users ? data.users : []

  return keys.map(key => users.find(user => user.id === key))
}
