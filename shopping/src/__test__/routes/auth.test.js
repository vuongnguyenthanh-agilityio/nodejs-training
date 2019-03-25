const request = require('supertest')
const { documentClient } = require('../../config/DynamoDb.js')
require('regenerator-runtime/runtime')
const ROUTER = require('../../constants/Router.js')
const app = require('../../index.js')

const tableName = 'User_Shopping_Test'

beforeEach(() => {
  const user = {
    companyId: '88888',
    name: 'Nguyen Thanh Trung',
    username: 'thanhtrung@gmail.com',
    password: 'trung@123',
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

afterEach(() => {
  var params = {
    TableName: tableName,
    Key: {
      'username': 'thanhtrung@gmail.com'
    }
  }

  console.log('Attempting a conditional delete...')
  documentClient.delete(params)
})

test('GET /api/v1/auth/login success', async () => {
  const response = await request(app)
    .get(ROUTER.AUTH_LOGIN)
    .send({
      'username': 'thanhtrung@gmail.com',
      'password': 'trung@123'
    })
  // expect(response.body.length).toBe(1)
  console.log('response body: ', response.body)
  expect(response.body).toHaveProperty('token')
  // expect(response.body[0]).toHaveProperty('name')
  expect(response.statusCode).toBe(200)
})
