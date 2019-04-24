import models from '../../models'
import UserModel from './UserModel'

describe('User Model: Create user', () => {
  const userModel = new UserModel()
  let userId = ''
  let userId1 = ''

  beforeAll(async () => {
    // Create a user to Database Test
    const userInput = {
      name: 'Nguyen Thanh Trung',
      username: 'thanhtrung@gmail.com',
      password: 'trung@123',
      role: 'CUSTOMER',
      phone: '0963216949',
      address: '38, Vu Dinh Long, Da Nang'
    }
    try {
      const res = await userModel.createUser(userInput)
      userId = res.id
      return res
    } catch (error) {
      throw new Error(error)
    }
  })

  afterAll(async () => {
    // Delete a user have created in Database Test
    try {
      await userModel.deleteUser(userId1)
      const res = await userModel.deleteUser(userId)
      return res
    } catch (error) {
      throw new Error(error)
    }
  })

  it('Create user failed when username is blank', async () => {
    const variables = {
      name: 'Nguyen Thanh Trung',
      username: '',
      password: 'trung@123',
      role: 'CUSTOMER',
      phone: '0963216949',
      address: '38, Vu Dinh Long, Da Nang'
    }
    try {
      await models.user.createUser(variables)
    } catch (error) {
      expect(error.message).toEqual('Form input invalid.')
      expect(error.extensions.code).toEqual('BAD_USER_INPUT')
    }
  }, 5000)

  it('Create user failed when password is blank', async () => {
    const variables = {
      name: 'Nguyen Thanh Trung',
      username: 'thanhvuong@gmail.com',
      password: '',
      role: 'CUSTOMER',
      phone: '0963216949',
      address: '38, Vu Dinh Long, Da Nang'
    }
    try {
      await models.user.createUser(variables)
    } catch (error) {
      expect(error.message).toEqual('Form input invalid.')
      expect(error.extensions.code).toEqual('BAD_USER_INPUT')
    }
  }, 5000)

  it('Create user failed when username incorrect format', async () => {
    const variables = {
      name: 'Nguyen Thanh Trung',
      username: 'thanhvuong',
      password: 'vuong@123',
      role: 'CUSTOMER',
      phone: '0963216949',
      address: '38, Vu Dinh Long, Da Nang'
    }
    try {
      await models.user.createUser(variables)
    } catch (error) {
      expect(error.message).toEqual('Username invalid.')
      expect(error.extensions.code).toEqual('BAD_USER_INPUT')
    }
  }, 5000)

  it('Create user failed when user arealy exists', async () => {
    const variables = {
      name: 'Nguyen Thanh Trung',
      username: 'thanhtrung@gmail.com',
      password: 'trung@123',
      role: 'CUSTOMER',
      phone: '0963216949',
      address: '38, Vu Dinh Long, Da Nang'
    }
    try {
      await models.user.createUser(variables)
    } catch (error) {
      expect(error.message).toEqual('User already exists.')
      expect(error.extensions.code).toEqual('ALREADY_EXISTS')
    }
  }, 5000)

  it('Create user successfully', async () => {
    const variables = {
      name: 'Nguyen Thanh Trung',
      username: 'test@gmail.com',
      password: 'trung@123',
      role: 'CUSTOMER',
      phone: '0963216949',
      address: '38, Vu Dinh Long, Da Nang'
    }
    const user = await models.user.createUser(variables)
    console.log('User successfully: ', user)
    userId1 = user.id
    expect(user.role).toEqual('CUSTOMER')
    expect(user.username).toEqual('test@gmail.com')
  }, 5000)
})
