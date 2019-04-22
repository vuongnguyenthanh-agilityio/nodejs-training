import supertest from 'supertest'

import app from '../../index'
import UserModel from './UserModel'
import { queryGetUser } from './QueryApi'

describe('User: GetUser', () => {
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

  it('Get user by id successfuly', async () => {
    await supertest(app)
      .post('/graphql')
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
})
