import supertest from 'supertest'

import app from '../../index'
import UserModel from './UserModel'
import { queryGetUser, querySignIn, queryGetUsers, queryDeleteUser } from './QueryApi'

describe('User', () => {
  const userModel = new UserModel()
  let userId = ''

  beforeAll(async () => {
    // Create a user to Database Test
    const userInput = {
      name: 'Nguyen Thanh Trung',
      username: 'thanhtrung@gmail.com',
      password: 'trung@123',
      role: 'ADMIN',
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
      const res = await userModel.deleteUser(userId)
      return res
    } catch (error) {
      throw new Error(error)
    }
  })

  describe('Get users', () => {
    let token = ''
    beforeAll(async () => {
      // Create a user to Database Test
      const variables = {
        username: 'thanhtrung@gmail.com',
        password: 'trung@123'
      }
      await supertest(app)
        .post('/graphql')
        .set('Accept', 'application/json')
        .send(querySignIn(variables))
        .expect((res) => {
          const data = res.body && res.body.data && res.body.data.signIn
          token = data.token
        })
    })

    it('Get user by id successfully have a item', async () => {
      await supertest(app)
        .post('/graphql')
        .set('x-token', token)
        .set('Accept', 'application/json')
        .send(queryGetUser({ id: userId }))
        .expect(200)
        .expect((res) => {
          const user = res.body && res.body.data && res.body.data.getUserById
          expect(user.id).toEqual(userId)
          expect(user.username).toEqual('thanhtrung@gmail.com')
          expect(user.role).toEqual('ADMIN')
          expect(user.address).toEqual('38, Vu Dinh Long, Da Nang')
          expect(user.phone).toEqual('0963216949')
        })
    }, 5000)

    it(`Get user by id successfully don't have item`, async () => {
      await supertest(app)
        .post('/graphql')
        .set('x-token', token)
        .set('Accept', 'application/json')
        .send(queryGetUser({ id: 'abcd1234' }))
        .expect(200)
        .expect((res) => {
          const user = res.body && res.body.data && res.body.data.getUserById
          expect(user).toBeNull()
        })
    }, 5000)

    it(`Get user by id failed when don't have token`, async () => {
      await supertest(app)
        .post('/graphql')
        .set('x-token', '')
        .set('Accept', 'application/json')
        .send(queryGetUser({ id: userId }))
        .expect(200)
        .expect((res) => {
          const data = res.body && res.body.errors[0]
          expect(data.message).toEqual('Not authenticated as user.')
          expect(data.extensions.code).toEqual('FORBIDDEN')
        })
    }, 5000)

    it(`Get user by id failed when user id is blank`, async () => {
      await supertest(app)
        .post('/graphql')
        .set('x-token', token)
        .set('Accept', 'application/json')
        .send(queryGetUser({ id: '' }))
        .expect(200)
        .expect((res) => {
          const data = res.body && res.body.errors[0]
          expect(data.message).toEqual('Invalid user id.')
          expect(data.extensions.code).toEqual('BAD_USER_INPUT')
        })
    }, 5000)

    it(`Get users without filter limit`, async () => {
      await supertest(app)
        .post('/graphql')
        .set('x-token', token)
        .set('Accept', 'application/json')
        .send(queryGetUsers({}))
        .expect(200)
        .expect((res) => {
          const data = res.body && res.body.data && res.body.data.getUsers
          expect(data.count).toBe(1)
          expect(data.nextToken).toEqual('')
          expect(data.users.length).toBe(1)
        })
    }, 5000)

    it(`Get users have filter with role is 'ADMIN'`, async () => {
      const variables = {
        filter: {
          role: 'ADMIN'
        }
      }

      await supertest(app)
        .post('/graphql')
        .set('x-token', token)
        .set('Accept', 'application/json')
        .send(queryGetUsers(variables))
        .expect(200)
        .expect((res) => {
          const data = res.body && res.body.data && res.body.data.getUsers
          expect(data.count).toBe(1)
          expect(data.nextToken).toEqual('')
          expect(data.users.length).toBe(1)
        })
    }, 5000)

    it(`Get users have filter with role is 'CUSTOMER'`, async () => {
      const variables = {
        filter: {
          role: 'CUSTOMER'
        }
      }

      await supertest(app)
        .post('/graphql')
        .set('x-token', token)
        .set('Accept', 'application/json')
        .send(queryGetUsers(variables))
        .expect(200)
        .expect((res) => {
          const data = res.body && res.body.data && res.body.data.getUsers
          expect(data).toBeNull()
        })
    }, 5000)
  })

  describe('Delete user', () => {
    let userIdDelete = ''
    let token = ''
    beforeAll(async () => {
      // Create a user to Database Test
      const userInput = {
        name: 'Nguyen Thanh Vuong',
        username: 'thanhvuong@gmail.com',
        password: 'vuong@123',
        role: 'CUSTOMER',
        phone: '0963216949',
        address: '38, Vu Dinh Long, Da Nang'
      }
      try {
        const res = await userModel.createUser(userInput)
        userIdDelete = res.id
        // Create a user to Database Test
        const variables = {
          username: 'thanhtrung@gmail.com',
          password: 'trung@123'
        }
        await supertest(app)
          .post('/graphql')
          .set('Accept', 'application/json')
          .send(querySignIn(variables))
          .expect((res) => {
            const data = res.body && res.body.data && res.body.data.signIn
            token = data.token
          })
        return res
      } catch (error) {
        throw new Error(error)
      }
    })
    it(`Delete user with user id is blank`, async () => {
      await supertest(app)
        .post('/graphql')
        .set('x-token', token)
        .set('Accept', 'application/json')
        .send(queryDeleteUser({ id: '' }))
        .expect(200)
        .expect((res) => {
          const data = res.body && res.body.errors[0]
          expect(data.message).toEqual('Invalid user id.')
          expect(data.extensions.code).toEqual('BAD_USER_INPUT')
        })
    }, 5000)

    it(`Delete user successfully'`, async () => {
      await supertest(app)
        .post('/graphql')
        .set('x-token', token)
        .set('Accept', 'application/json')
        .send(queryDeleteUser({ id: userIdDelete }))
        .expect(200)
        .expect((res) => {
          const user = res.body && res.body.data && res.body.data.deleteUser
          expect(user.id).toEqual(userIdDelete)
          expect(user.username).toEqual('thanhvuong@gmail.com')
          expect(user.role).toEqual('CUSTOMER')
          expect(user.address).toEqual('38, Vu Dinh Long, Da Nang')
          expect(user.phone).toEqual('0963216949')
        })
    }, 5000)
  })

  describe(`Delete user permission`, () => {
    let userId1 = ''
    let userId2 = ''
    let token = ''
    beforeAll(async () => {
      // Create a user to Database Test
      const userInput1 = {
        name: 'Nguyen Thanh Trung',
        username: 'honghanh@gmail.com',
        password: 'trung@123',
        role: 'CUSTOMER',
        phone: '0963216949',
        address: '38, Vu Dinh Long, Da Nang'
      }
      const userInput2 = {
        name: 'Nguyen Thanh Vuong',
        username: 'thanhvuong@gmail.com',
        password: 'vuong@123',
        role: 'CUSTOMER',
        phone: '0963216949',
        address: '38, Vu Dinh Long, Da Nang'
      }
      try {
        const res1 = await userModel.createUser(userInput1)
        const res2 = await userModel.createUser(userInput2)
        userId1 = res1.id
        userId2 = res2.id
        // Create a user to Database Test
        const variables = {
          username: 'honghanh@gmail.com',
          password: 'trung@123'
        }
        await supertest(app)
          .post('/graphql')
          .set('Accept', 'application/json')
          .send(querySignIn(variables))
          .expect((res) => {
            const data = res.body && res.body.data && res.body.data.signIn
            token = data.token
          })
        return res1
      } catch (error) {
        throw new Error(error)
      }
    })

    afterAll(async () => {
      // Delete a user have created in Database Test
      try {
        const res = await userModel.deleteUser(userId2)
        return res
      } catch (error) {
        throw new Error(error)
      }
    })

    it(`Delete user failed when same role and diffrent user id`, async () => {
      await supertest(app)
        .post('/graphql')
        .set('x-token', token)
        .set('Accept', 'application/json')
        .send(queryDeleteUser({ id: userId2 }))
        .expect(200)
        .expect((res) => {
          const data = res.body && res.body.errors[0]
          expect(data.message).toEqual('No permission.')
        })
    }, 5000)

    it(`Delete user failed when same role and same user id`, async () => {
      await supertest(app)
        .post('/graphql')
        .set('x-token', token)
        .set('Accept', 'application/json')
        .send(queryDeleteUser({ id: userId1 }))
        .expect(200)
        .expect((res) => {
          const user = res.body && res.body.data && res.body.data.deleteUser
          expect(user.id).toEqual(userId1)
          expect(user.username).toEqual('honghanh@gmail.com')
          expect(user.role).toEqual('CUSTOMER')
          expect(user.address).toEqual('38, Vu Dinh Long, Da Nang')
          expect(user.phone).toEqual('0963216949')
        })
    }, 5000)
  })
})
