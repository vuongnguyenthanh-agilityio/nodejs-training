import { AuthenticationError, UserInputError, ApolloError } from 'apollo-server'
import uuidv4 from 'uuid/v4'

import { isValideEmail, isValidePhoneNumber } from '../utils/Validators'
import Database from '../db'

const tableName = 'Shopping'
const globalIndexOne = 'GSI_1'

export default class UserModel {
  async createUser (user) {
    const { username, name, phone, address, password, role } = user
    // Check valide username
    if (!isValideEmail(username) || !isValidePhoneNumber(phone) || !name || !password) {
      throw new UserInputError('Form Arguments invalid', { invalidArgs: username })
    }

    // Check user already exists
    const res = await this.getUserByUsername(username)
    if (res && res.Item) {
      throw new ApolloError('User already exists ', 'EXISTS', { username })
    }
    const id = uuidv4()
    const item = {
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
        N: phone.toString()
      },
      address: {
        S: address.toString()
      },
      password: {
        S: password.toString()
      },
      role: {
        S: role.toString()
      }
    }

    const db = await this.getDatabase()
    await db.putItem({
      TableName: tableName,
      Item: item
    })
  }

  async getUserByUsername (username) {
    const db = await this.getDatabase()
    return db.getItem({
      TableName: tableName,
      IndexName: globalIndexOne,
      Key: {
        username: {
          S: username.toString()
        }
      }
    })
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
