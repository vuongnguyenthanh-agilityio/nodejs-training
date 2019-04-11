
export default {
  Query: {
  },

  Mutation: {
    signUp: async (
      parent,
      { username, email, password },
      { models, secret }
    ) => {
      const user = await models.User.create({
        username,
        email,
        password
      })

      return { token: createToken(user, secret, '30m') }
    }
  }
}
