require('regenerator-runtime/runtime')
const request = require('supertest')
const { documentClient } = require('../../config/DynamoDb.js')
const ROUTER = require('../../constants/Router.js')
const app = require('../../index.js')
const bcrypt = require('bcrypt')

const tableNameUser = 'User_Shopping_Test'
const tableNameProduct = 'Product_Shopping_Test'

beforeEach(async () => {
  const salt = bcrypt.genSaltSync()
  const bcryptPassword = bcrypt.hashSync('trung@123', salt)
  const user = {
    companyId: '88888',
    name: 'Nguyen Thanh Trung',
    username: 'product@gmail.com',
    password: bcryptPassword,
    address: 'Da Nang',
    photos: 'https://images.pexels.com/photos/5390/sunset-hands-love-woman.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500'
  }
  // seed with some data
  const params = {
    TableName: tableNameUser,
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

  await documentClient.put(params, (error, data) => {
    if (error) {
      console.error('Unable to create user product@gmail.com. Error JSON:', JSON.stringify(error, null, 2))
    } else {
      console.log('Create user product@gmail.com succeeded:', JSON.stringify(data, null, 2))
    }
  })
})

describe('GET /api/v1/products Exit token', () => {
  let token = ''
  const productId = new Date().getTime().toString()
  beforeEach(async () => {
    const response = await request(app)
      .post(ROUTER.AUTH_LOGIN)
      .send({
        username: 'product@gmail.com',
        password: 'trung@123'
      })
    token = response.body ? response.body.token : ''

    const product = {
      categoryId: '0001',
      companyId: '88888',
      name: 'Iphone 7',
      price: 1000000,
      photos: 'https://images.pexels.com/photos/5390/sunset-hands-love-woman.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500'
    }

    const paramsProduct = {
      TableName: tableNameProduct,
      Item: {
        'id': productId,
        'categoryId': product.categoryId,
        'companyId': product.companyId,
        'name': product.name,
        'price': product.price,
        'photos': product.photos
      }
    }
    await documentClient.put(paramsProduct, (error, data) => {
      if (error) {
        console.error('Unable to create Product. Error JSON:', JSON.stringify(error, null, 2))
      } else {
        console.log('Create Product succeeded:', JSON.stringify(data, null, 2))
      }
    })
  })

  test('should return JSON array', async () => {
    const response = await request(app)
      .get(ROUTER.PRODUCTS)
      .set('authorization', `Bearer ${token}`)

    console.log('product body array: ', response.body.products)

    expect(response.body.products).toBeInstanceOf(Array)
  }, 10000)

  test('should return full property', async () => {
    let expectedProps = ['id', 'categoryId', 'companyId', 'name', 'price', 'photos']

    const response = await request(app)
      .get(ROUTER.PRODUCTS)
      .set('authorization', `Bearer ${token}`)

    // console.log('product body: ', response)
    let sampleKeys = Object.keys(response.body.products[0])

    expectedProps.forEach((key) => {
      expect(sampleKeys.includes(key)).toBe(true)
    })

    expect(response.statusCode).toBe(200)
  }, 10000)

  afterEach(async () => {
    const paramsProduct = {
      TableName: tableNameProduct,
      Key: {
        'categoryId': '0001',
        'id': '1553584358163'
      }
    }

    await documentClient.delete(paramsProduct)
  })
})

afterEach(() => {
  var params = {
    TableName: tableNameUser,
    Key: {
      'username': 'thanhtrung@gmail.com'
    }
  }

  return documentClient.delete(params)
})
