import { UserInputError, ApolloError } from 'apollo-server'
import uuidv4 from 'uuid/v4'
import bcrypt from 'bcrypt'

import { isValidateEmail } from '../utils/Validators'
import Database from '../db'

const tableName = process.env.NODE_ENV === 'test' ? 'Shopping_Test' : 'Shopping'
const globalIndexOne = 'GSI_1'

export default class UserModel {
  async createUser (user) {
    const { username, name, phone, address, password, role } = user
    // Check valid some attribute that requires input
    if (!username || !password || !role || !name || !phone) {
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
    const salt = bcrypt.genSaltSync()
    const bcryptPassword = bcrypt.hashSync(password, salt)

    const id = uuidv4()
    const item1 = {
      pk: {
        S: `User_${id}`
      },
      sk: {
        S: 'USER_DETAIL'
      },
      data: {
        S: role.toString()
      },
      username: {
        S: username.toString()
      },
      name: {
        S: name.toString()
      },
      phone: {
        S: phone.toString()
      },
      datetime: {
        S: '2019-04-12'
      }
    }

    if (address) {
      item1.address = {
        S: address && address.toString()
      }
    }

    const item2 = {
      pk: {
        S: `User_${id}`
      },
      sk: {
        S: 'USER_LOGIN'
      },
      data: {
        S: username.toString()
      },
      password: {
        S: bcryptPassword.toString()
      },
      role: {
        S: role.toString()
      },
      datetime: {
        S: '2019-04-12'
      }
    }

    const db = await this.getDatabase()
    try {
      await db.putItem({
        TableName: tableName,
        Item: item1
      })
      await db.putItem({
        TableName: tableName,
        Item: item2
      })
      // FIXME: Will update

      // await db.batchWriteItem({
      //   RequestItems: {
      //     tableName: [
      //       {
      //         PutRequest: {
      //           Item: item1
      //         }
      //       },
      //       {
      //         PutRequest: {
      //           Item: item2
      //         }
      //       }
      //     ]
      //   }
      // })
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

  async getUserByUsername (username = '') {
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
          S: 'USER_LOGIN'
        },
        ':sk': {
          S: username.toString()
        }
      }
    }
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
  }

  async deleteUser (id = '') {
    const db = await this.getDatabase()
    try {
      const user1 = await db.deleteItem({
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

      const user2 = await db.deleteItem({
        TableName: tableName,
        Key: {
          pk: {
            S: id.toString()
          },
          sk: {
            S: 'USER_LOGIN'
          }
        },
        ReturnValues: 'ALL_OLD'
      })

      const { Attributes: { name, phone, address, photos } } = user1
      const { Attributes: { pk, data, role } } = user2

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
