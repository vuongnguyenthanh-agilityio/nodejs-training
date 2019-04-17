import { UserInputError, ApolloError } from 'apollo-server'
import uuidv4 from 'uuid/v4'

import Database from '../db'

const tableName = process.env.NODE_ENV === 'test' ? 'Shopping_Test' : 'Shopping'
const globalIndexOne = 'GSI_1'

export default class CategoryModel {
  async createCategory (category) {
    const { name, parentId, description, datetime, userId } = category
    console.log('Category: ', category)
    // Check valid some attribute that requires input
    if (!name) {
      throw new UserInputError('Form input invalid.', { category })
    }

    // Check user already exists
    const categoryExists = await this.getCategoryByName(name)
    if (categoryExists) {
      throw new ApolloError('Category already exists.', 'ALREADY_EXISTS', { name })
    }

    const id = uuidv4()
    const item = {
      pk: {
        S: `Category_${id}`
      },
      sk: {
        S: 'CATEGORY_DETAIL'
      },
      data: {
        S: name.toString()
      },
      parentId: {
        S: parentId ? parentId.toString() : '0'
      },
      createdBy: {
        S: userId
      },
      datetime: {
        S: datetime.toString()
      }
    }

    if (description) {
      item.description = {
        S: description.toString()
      }
    }

    const db = await this.getDatabase()
    try {
      await db.putItem({
        TableName: tableName,
        Item: item
      })
    } catch (error) {
      throw new Error(error)
    }
    return {
      id: `Category_${id}`,
      name,
      parentId,
      description,
      createdBy: userId
    }
  }

  async getCategoryByName (name = '') {
    // Check valid some attribute that requires input
    if (!name) {
      throw new UserInputError('Invalid category name', { name })
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
          S: 'CATEGORY_DETAIL'
        },
        ':sk': {
          S: name.toString()
        }
      }
    }
    const results = await db.query(param)
    if (results && results.Items && results.Items.length > 0) {
      const category = results.Items[0]
      const { pk, data, parentId, description, createdBy } = category
      return {
        id: pk.S,
        name: data && data.S,
        parentId: parentId && parentId.S,
        description: description && description.S,
        createdBy: createdBy && createdBy.S
      }
    }
  }

  async getCategoryById (id) {
    // Check valid some attribute that requires input
    if (!id) {
      throw new UserInputError('Invalid category name', { id })
    }
    const db = await this.getDatabase()
    const param = {
      TableName: tableName,
      Key: {
        pk: {
          S: id.toString()
        },
        sk: {
          S: 'CATEGORY_DETAIL'
        }
      }
    }
    const results = await db.getItem(param)

    if (results && results.Item) {
      const category = results.Item
      const { pk, data, parentId, description, createdBy } = category
      return {
        id: pk.S,
        name: data && data.S,
        parentId: parentId && parentId.S,
        description: description && description.S,
        createdBy: createdBy && createdBy.S
      }
    }
  }

  async getCategories (filter = {}) {
    const db = await this.getDatabase()
    const { datetime, parentId, createdBy } = filter
    // Condition for create filter
    const filterValue = `
      ${datetime ? '#datetime = :datetime' : ''}
      ${parentId ? '#parentId = :parentId' : ''}
      ${createdBy && createdBy.id ? '#createdBy.#id = :createdByUserId' : ''}
      ${createdBy && createdBy.role ? '#createdBy.#role = :createdByUserRole' : ''}
    `
    const param = {
      TableName: tableName,
      IndexName: globalIndexOne,
      KeyConditionExpression: '#pk = :pk',
      FilterExpression: filterValue,
      ExpressionAttributeNames: {
        '#pk': 'sk',
        '#datetime': 'datetime',
        '#parentId': 'parentId',
        '#createdBy': 'createdBy',
        '#id': 'id',
        '#role': 'role'
      },
      ExpressionAttributeValues: {
        ':pk': {
          S: 'CATEGORY_DETAIL'
        },
        ':datetime': {
          S: datetime
        },
        ':parentId': {
          S: parentId
        },
        ':createdByUserId': {
          S: createdBy && createdBy.id
        },
        ':createdByUserRole': {
          S: createdBy && createdBy.role
        }
      }
    }
    const results = await db.query(param)

    if (results && results.Items && results.Items.length > 0) {
      results.Items.map(category => {
        const { pk, data, parentId, description, createdBy } = category

        return {
          id: pk.S,
          name: data && data.S,
          parentId: parentId && parentId.S,
          description: description && description.S,
          createdBy: createdBy && createdBy.S
        }
      })
    }
  }

  async deleteCategory (id = '') {
    // Check valid some attribute that requires input
    if (!id) {
      throw new UserInputError('Invalid category name', { id })
    }
    const db = await this.getDatabase()
    try {
      const category = await db.deleteItem({
        TableName: tableName,
        Key: {
          pk: {
            S: id.toString()
          },
          sk: {
            S: 'CATEGORY_DETAIL'
          }
        },
        ReturnValues: 'ALL_OLD'
      })

      const { Attributes: { pk, data, parentId, description, createdBy } } = category

      return {
        id: pk.S,
        name: data && data.S,
        parentId: parentId && parentId.S,
        description: description && description.S,
        createdBy: createdBy && createdBy.S
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
