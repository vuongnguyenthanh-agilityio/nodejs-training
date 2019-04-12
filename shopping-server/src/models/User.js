import { AuthenticationError, UserInputError, ApolloError } from 'apollo-server'
import uuidv4 from 'uuid/v4'
import bcrypt from 'bcrypt'

import { isValidateEmail, isValidatePhoneNumber } from '../utils/Validators'
import Database from '../db'

const tableName = 'Shopping'
const globalIndexOne = 'GSI_1'

export default class UserModel {
  async createUser (user) {
    const { username, name, phone, address, password, role } = user
    // Check valide username
    if (!isValidateEmail(username)) {
      throw new UserInputError('User invalid', { username: username })
    }

    // Check user already exists
    try {
      const res = await this.getUserByUsername(username)
      if (res && res.Items && res.Items.length > 0) {
        throw new ApolloError('User already exists ', 'ALREADY_EXISTS', { username })
      }
    } catch (error) {
      throw new Error(error)
    }

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
      address: {
        S: address && address.toString()
      },
      role: {
        S: role.toString()
      },
      datetime: {
        S: '2019-04-12'
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
      throw new Error(error)
    }
    return {
      id: `User_${id}`,
      username,
      name,
      phone,
      role,
      address
    }
  }

  async getUserByUsername (username) {
    const db = await this.getDatabase()
    return db.query({
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
