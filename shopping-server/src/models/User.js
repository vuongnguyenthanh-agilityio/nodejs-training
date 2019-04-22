import { UserInputError, ApolloError } from 'apollo-server'
import uuidv4 from 'uuid/v4'
import moment from 'moment'

import { isValidateEmail } from '../utils/Validators'
import Database from '../db'
import { encodePassword, decodeBase64 } from '../utils/Utilties'

const tableName = process.env.NODE_ENV === 'test' ? 'Shopping_Test' : 'Shopping'
const globalIndexOne = 'GSI_1'
const globalIndexTwo = 'GSI_2'

export default class UserModel {
  async createUser (user) {
    const { username, name, phone, address, password, role } = user
    // Check valid some attribute that requires input
    if (!username || !password) {
      throw new UserInputError('Form input invalid.', { user })
    }
    // Check valide username
    if (!isValidateEmail(username)) {
      throw new UserInputError('Username invalid.', { username: username })
    }

    // Check user already exists
    const userExists = await this.getUserByUsername(username)
    if (userExists) {
      throw new ApolloError('User already exists.', 'ALREADY_EXISTS', { username })
    }

    // encode password
    const bcryptPassword = encodePassword(password)

    const id = uuidv4()
    const datetime = moment().format()
    const item = {
      pk: {
        S: `User_${id}`
      },
      sk: {
        S: 'USER_DETAIL'
      },
      data: {
        S: username.toString()
      },
      role: {
        S: role ? role.toString() : 'CUSTOMER'
      },
      password: {
        S: bcryptPassword.toString()
      },
      datetime: {
        S: datetime
      }
    }

    if (address) {
      item.address = {
        S: address.toString()
      }
    }
    if (phone) {
      item.phone = {
        S: phone.toString()
      }
    }
    if (name) {
      item.name = {
        S: name.toString()
      }
    }

    const db = await this.getDatabase()
    try {
      await db.putItem({
        TableName: tableName,
        Item: item
      })
    } catch (error) {
      console.log('Create user error: ', error)
      throw new Error(error)
    }
    return {
      id: `User_${id}`,
      username,
      role
    }
  }

  async getUserByUsername (username) {
    // Check valid some attribute that requires input
    if (!username) {
      throw new UserInputError('Invalid username.', { username })
    }
    const db = await this.getDatabase()
    const param = {
      TableName: tableName,
      IndexName: globalIndexOne,
      KeyConditionExpression: '#pk = :pk AND #sk = :sk',
      ExpressionAttributeNames: {
        '#pk': 'sk',
        '#sk': 'data'
      },
      ExpressionAttributeValues: {
        ':pk': {
          S: 'USER_DETAIL'
        },
        ':sk': {
          S: username.toString()
        }
      }
    }
    try {
      const results = await db.query(param)
      if (results && results.Items && results.Items.length > 0) {
        const user = results.Items[0]
        return {
          id: user.pk.S,
          username: user.data.S,
          role: user.role.S,
          password: user.password.S
        }
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async getUsers ({ filter = {}, limit, nextToken }) {
    const { role } = filter
    const db = await this.getDatabase()
    const param = {
      TableName: tableName,
      IndexName: globalIndexTwo,
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: {
        '#pk': 'sk'
      },
      ExpressionAttributeValues: {
        ':pk': {
          S: 'USER_DETAIL'
        }
      },
      ScanIndexForward: false,
      Limit: limit
    }
    let filterExpression = ''

    // Add filter by categoryId if have categoryId
    if (role) {
      param.ExpressionAttributeValues[':role'] = {
        S: role
      }
      param.ExpressionAttributeNames['#role'] = 'role'
      filterExpression = '#role = :role'
    }

    // Add FilterExpression to param If exists any filter
    if (filterExpression) {
      param.FilterExpression = filterExpression
    }
    try {
      // Qyery to database by param
      const results = await db.query(param)
      if (results && results.Items && results.Items.length > 0) {
        const users = results.Items.map(user => {
          const { pk, data, name, role, phone, address, photos, datetime } = user
          return {
            id: pk.S,
            username: data && data.S,
            role: role && role.S,
            name: name && name.S,
            phone: phone && phone.S,
            address: address && address.S,
            createdAt: datetime && datetime.S,
            photos: photos && photos.L
          }
        })

        return {
          users,
          count: results.Count,
          nextToken: decodeBase64(JSON.stringify(results.LastEvaluatedKey))
        }
      }
    } catch (error) {
      console.log('Error: ', error)
      throw new Error(error)
    }
  }

  async getUserById (id) {
    // Check valid some attribute that requires input
    if (!id) {
      throw new UserInputError('Invalid user id', { id })
    }
    const db = await this.getDatabase()
    const param = {
      TableName: tableName,
      Key: {
        pk: {
          S: id.toString()
        },
        sk: {
          S: 'USER_DETAIL'
        }
      }
    }
    const results = await db.getItem(param)

    if (results && results.Item) {
      const user = results.Item
      const { pk, data, name, role, phone, address, photos, datetime } = user

      return {
        id: pk.S,
        username: data && data.S,
        role: role && role.S,
        name: name && name.S,
        phone: phone && phone.S,
        address: address && address.S,
        createdAt: datetime && datetime.S,
        photos: photos && photos.L
      }
    }
  }

  async deleteUser (id) {
    // Check valid some attribute that requires input
    if (!id) {
      throw new UserInputError('Invalid user id', { id })
    }
    const db = await this.getDatabase()
    try {
      const user = await db.deleteItem({
        TableName: tableName,
        Key: {
          pk: {
            S: id.toString()
          },
          sk: {
            S: 'USER_DETAIL'
          }
        },
        ReturnValues: 'ALL_OLD'
      })

      const { Attributes: { pk, data, role, name, phone, address, photos } } = user

      return {
        id: pk && pk.S,
        username: data && data.S,
        role: role && role.S,
        name: name && name.S,
        phone: phone && phone.S,
        address: address && address.S,
        photos: photos && photos.L
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Get installation from Database
   */
  async getDatabase () {
    if (!this._db) {
      this._db = new Database()
      await this._db.connect()
    }

    return this._db
  }
}
