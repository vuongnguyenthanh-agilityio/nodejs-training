require('regenerator-runtime/runtime')
const request = require('supertest')
const { documentClient } = require('../../config/DynamoDb.js')
const ROUTER = require('../../constants/Router.js')
const app = require('../../index.js')
const bcrypt = require('bcrypt')

const tableName = 'User_Shopping_Test'
// app.listen(3002, () => console.log(`Products API - Port ${3002}`))

beforeEach(() => {
  const salt = bcrypt.genSaltSync()
  const bcryptPassword = bcrypt.hashSync('trung@123', salt)
  const user = {
    companyId: '88888',
    name: 'Nguyen Thanh Trung',
    username: 'thanhtrung@gmail.com',
    password: bcryptPassword,
    address: 'Da Nang',
    photos: 'https://images.pexels.com/photos/5390/sunset-hands-love-woman.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  }
  // seed with some data
  const params = {
    TableName: tableName,
    Item: {
      'id': new Date().getTime().toString(),
      'companyId': user.companyId,
      'username': user.username,
      'name': user.name,
      'password': user.password,
      'address': user.address,
      'photos': user.photos
    }
  }
  documentClient.put(params, (error, data) => {
    if (error) {
      console.error('Unable to create item. Error JSON:', JSON.stringify(error, null, 2))
    } else {
      console.log('CreateItem succeeded:', JSON.stringify(data, null, 2))
    }
  })
})

afterEach(async () => {
  var params = {
    TableName: tableName,
    Key: {
      'username': 'thanhtrung@gmail.com'
    }
  }

  documentClient.delete(params)
})

test('POST /api/v1/auth/login success', async () => {
  const response = await request(app)
    .post(ROUTER.AUTH_LOGIN)
    .send({
      username: 'thanhtrung@gmail.com',
      password: 'trung@123'
    })
  console.log('response body: ', response.body)
  expect(response.body).toHaveProperty('token')
  expect(response.statusCode).toBe(200)
}, 10000)

test('POST /api/v1/auth/login Failed', async () => {
  const response = await request(app)
    .post(ROUTER.AUTH_LOGIN)
    .send({
      username: 'abcd@gmail.com',
      password: 'trung@123'
    })
  console.log('response body: ', response.body)
  expect(response.body.errorCode).toBe(100)
  expect(response.body.message).toEqual('Incorrect password')
  expect(response.statusCode).toBe(401)
}, 10000)
