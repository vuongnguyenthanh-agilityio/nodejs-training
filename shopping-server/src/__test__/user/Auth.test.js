import supertest from 'supertest'

import app from '../../index'
import UserModel from './UserModel'
import { querySignIn, querySignUp } from './QueryApi'

describe('Athentication: SignIn', () => {
  const userModel = new UserModel()
  let userId = ''

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
      if (userId) {
        const res = await userModel.deleteUser(userId)
        return res
      }
    } catch (error) {
      throw new Error(error)
    }
  })

  it('SignIn successfully', async () => {
    const variables = {
      username: 'thanhtrung@gmail.com',
      password: 'trung@123'
    }
    await supertest(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send(querySignIn(variables))
      .expect(200)
      .expect((res) => {
        const data = res.body && res.body.data && res.body.data.signIn
        expect(data).toHaveProperty('token')
        expect(data.user.username).toEqual('thanhtrung@gmail.com')
        expect(data.user.role).toEqual('CUSTOMER')
        expect(data.user.id).toEqual(userId)
      })
  }, 5000)

  it('SignIn failed when do not input username and password', async () => {
    const variables = {
      username: '',
      password: ''
    }
    await supertest(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send(querySignIn(variables))
      .expect(200)
      .expect((res) => {
        const data = res.body && res.body.errors[0]
        expect(data.message).toEqual('Invalid username.')
        expect(data.extensions.code).toEqual('BAD_USER_INPUT')
      })
  }, 5000)

  it('SignIn failed when input username incorrect', async () => {
    const variables = {
      username: '12345',
      password: 'trung@123'
    }
    await supertest(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send(querySignIn(variables))
      .expect(200)
      .expect((res) => {
        const data = res.body && res.body.errors[0]
        expect(data.message).toEqual('No user found with this login credentials.')
        expect(data.extensions.code).toEqual('BAD_USER_INPUT')
      })
  }, 5000)

  it('SignIn failed when input password incorrect', async () => {
    const variables = {
      username: 'thanhtrung@gmail.com',
      password: '123456'
    }
    await supertest(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send(querySignIn(variables))
      .expect(200)
      .expect((res) => {
        const data = res.body && res.body.errors[0]
        expect(data.message).toEqual('Invalid password.')
        expect(data.extensions.code).toEqual('UNAUTHENTICATED')
      })
  }, 5000)
})

describe('Authencation: SignUp', () => {
  const userModel = new UserModel()
  let userId = ''
  afterAll(async () => {
    // Delete a user have created in Database Test
    try {
      if (userId) {
        const res = await userModel.deleteUser(userId)
        return res
      }
    } catch (error) {
      throw new Error(error)
    }
  })

  it('SignUp successfully', async () => {
    const user = {
      name: 'Nguyen Thanh Vuong',
      username: 'thanhvuong@gmail.com',
      password: 'vuong@123',
      role: 'CUSTOMER',
      phone: '0963216949',
      address: '38, Vu Dinh Long, Da Nang'
    }

    await supertest(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send(querySignUp({ input: user }))
      .expect(200)
      .expect((res) => {
        const data = res.body && res.body.data && res.body.data.signUp
        userId = data && data.user && data.user.id
        expect(data).toHaveProperty('token')
        expect(data.user.username).toEqual('thanhvuong@gmail.com')
        expect(data.user.role).toEqual('CUSTOMER')
      })
  }, 5000)

  it('SignUp failed when do not input all attribute', async () => {
    const user = {
      name: '',
      username: '',
      password: '',
      role: 'CUSTOMER',
      phone: '',
      address: ''
    }
    await supertest(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send(querySignUp({ input: user }))
      .expect(200)
      .expect((res) => {
        const data = res.body && res.body.errors && res.body.errors[0]
        expect(data.message).toEqual('Form input invalid.')
        expect(data.extensions.code).toEqual('BAD_USER_INPUT')
      })
  }, 5000)

  it('SignUp failed when input username incorrect formart', async () => {
    const user = {
      name: 'Nguyen Thanh Trung',
      username: 'thanhtrung',
      password: 'trung@123',
      role: 'CUSTOMER',
      phone: '0963216949',
      address: '38, Vu Dinh Long, Da Nang'
    }
    await supertest(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send(querySignUp({ input: user }))
      .expect(200)
      .expect((res) => {
        const data = res.body && res.body.errors && res.body.errors[0]
        expect(data.message).toEqual('Username invalid.')
        expect(data.extensions.code).toEqual('BAD_USER_INPUT')
      })
  }, 5000)
})

describe('Authenticaton: SignUp', () => {
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
      if (userId) {
        const res = await userModel.deleteUser(userId)
        return res
      }
    } catch (error) {
      throw new Error(error)
    }
  })

  it('SignUp failed when input username already exists', async () => {
    const user = {
      name: 'Nguyen Thanh Trung',
      username: 'thanhtrung@gmail.com',
      password: 'trung@123',
      role: 'CUSTOMER',
      phone: '0963216949',
      address: '38, Vu Dinh Long, Da Nang'
    }
    await supertest(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .send(querySignUp({ input: user }))
      .expect(200)
      .expect((res) => {
        const data = res.body && res.body.errors && res.body.errors[0]
        expect(data.message).toEqual('User already exists.')
        expect(data.extensions.code).toEqual('ALREADY_EXISTS')
      })
  }, 5000)
})
