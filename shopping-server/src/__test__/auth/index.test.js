import 'regenerator-runtime/runtime'
import { signIn, signUp } from './Api'
import UserModel from './UserModel'

describe('SignIn', () => {
  const userModel = new UserModel()
  let userId = ''

  beforeAll(async () => {
    const user = {
      name: 'Nguyen Thanh Trung',
      username: 'thanhtrung@gmail.com',
      password: 'trung@123',
      role: 'ADMIN',
      phone: '0963216949',
      address: '38, Vu Dinh Long, Da Nang'
    }

    // Create a user to Database Test
    try {
      const res = await userModel.createUser(user)
      userId = res.id
      return res
    } catch (error) {
      throw new Error(error)
    }
  })

  afterAll(async () => {
    // Delete a user have created in Database Test
    try {
      const res = await userModel.deleteUser(userId)
      return res
    } catch (error) {
      throw new Error(error)
    }
  })

  it('SignIn successfully', async () => {
    const variable = {
      username: 'thanhtrung@gmail.com',
      password: 'trung@123'
    }
    const results = await signIn(variable)
    const data = results.data && results.data.data && results.data.data.signIn
    expect(data).toHaveProperty('token')
    expect(data.user.username).toEqual('thanhtrung@gmail.com')
    expect(data.user.role).toEqual('ADMIN')
  }, 5000)

  it('SignIn failed when do not input username and password', async () => {
    const variable = {
      username: '',
      password: ''
    }
    const results = await signIn(variable)
    const data = results.data && results.data.errors && results.data.errors[0]
    expect(data.message).toEqual('Form input invalid.')
    expect(data.extensions.code).toEqual('BAD_USER_INPUT')
  }, 5000)

  it('SignIn failed when input username incorrect', async () => {
    const variable = {
      username: '12345',
      password: 'trung@123'
    }
    const results = await signIn(variable)
    const data = results.data && results.data.errors && results.data.errors[0]
    expect(data.message).toEqual('No user found with this login credentials.')
    expect(data.extensions.code).toEqual('BAD_USER_INPUT')
  }, 5000)

  it('SignIn failed when input password incorrect', async () => {
    const variable = {
      username: 'thanhtrung@gmail.com',
      password: '123456'
    }
    const results = await signIn(variable)
    const data = results.data && results.data.errors && results.data.errors[0]
    expect(data.message).toEqual('Invalid password.')
    expect(data.extensions.code).toEqual('UNAUTHENTICATED')
  }, 5000)
})

describe('SignUp', () => {
  const userModel = new UserModel()
  let userId = ''
  afterAll(async () => {
    // Delete a user have created in Database Test
    try {
      const res = await userModel.deleteUser(userId)
      return res
    } catch (error) {
      throw new Error(error)
    }
  })
  it('SignUp successfully', async () => {
    const user = {
      name: 'Nguyen Thanh Trung',
      username: 'thanhtrung@gmail.com',
      password: 'trung@123',
      role: 'ADMIN',
      phone: '0963216949',
      address: '38, Vu Dinh Long, Da Nang'
    }
    const variable = {
      input: user
    }
    const results = await signUp(variable)
    const data = results.data && results.data.data && results.data.data.signUp
    userId = data && data.user && data.user.id
    expect(data).toHaveProperty('token')
    expect(data.user.username).toEqual('thanhtrung@gmail.com')
    expect(data.user.role).toEqual('ADMIN')
  }, 5000)

  it('SignUp failed when do not input all attribute', async () => {
    const user = {
      name: '',
      username: '',
      password: '',
      role: '',
      phone: '',
      address: ''
    }
    const variable = {
      input: user
    }
    const results = await signUp(variable)
    const data = results.data && results.data.errors && results.data.errors[0]
    expect(data.message).toEqual('Form input invalid.')
    expect(data.extensions.code).toEqual('BAD_USER_INPUT')
  }, 5000)

  it('SignUp failed when input username incorrect formart', async () => {
    const user = {
      name: 'Nguyen Thanh Trung',
      username: 'thanhtrung',
      password: 'trung@123',
      role: 'ADMIN',
      phone: '0963216949',
      address: '38, Vu Dinh Long, Da Nang'
    }
    const variable = {
      input: user
    }
    const results = await signUp(variable)
    const data = results.data && results.data.errors && results.data.errors[0]
    expect(data.message).toEqual('Username invalid.')
    expect(data.extensions.code).toEqual('BAD_USER_INPUT')
  }, 5000)
})

describe('SignUp with username already exists', () => {
  const userModel = new UserModel()
  let userId = ''

  beforeAll(async () => {
    const user = {
      name: 'Nguyen Thanh Trung',
      username: 'thanhtrung@gmail.com',
      password: 'trung@123',
      role: 'ADMIN',
      phone: '0963216949',
      address: '38, Vu Dinh Long, Da Nang'
    }

    // Create a user to Database Test
    try {
      const res = await userModel.createUser(user)
      userId = res.id
      return res
    } catch (error) {
      throw new Error(error)
    }
  })

  afterAll(async () => {
    // Delete a user have created in Database Test
    try {
      const res = await userModel.deleteUser(userId)
      return res
    } catch (error) {
      throw new Error(error)
    }
  })

  it('Username already exists', async () => {
    const user = {
      name: 'Nguyen Thanh Trung',
      username: 'thanhtrung@gmail.com',
      password: 'trung@123',
      role: 'ADMIN',
      phone: '0963216949',
      address: '38, Vu Dinh Long, Da Nang'
    }
    const variable = {
      input: user
    }
    const results = await signUp(variable)
    const data = results.data && results.data.errors && results.data.errors[0]
    expect(data.message).toEqual('User already exists.')
    expect(data.extensions.code).toEqual('ALREADY_EXISTS')
  }, 5000)
})
