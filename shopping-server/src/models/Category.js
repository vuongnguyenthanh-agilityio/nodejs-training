import { UserInputError, ApolloError } from 'apollo-server'
import uuidv4 from 'uuid/v4'

import Database from '../db'
import { encodeBase64, decodeBase64 } from '../utils/Utilties'

const tableName = process.env.NODE_ENV === 'test' ? 'Shopping_Test' : 'Shopping'
const globalIndexOne = 'GSI_1'
const globalIndexTwo = 'GSI_2'

export default class CategoryModel {
  async putCategory (category) {
    const { name, parentId, description, datetime, userId, id } = category
    // Check valid some attribute that requires input
    if (!name) {
      throw new UserInputError('Form input invalid.', { category })
    }

    // Check user already exists
    const categoryExists = await this.getCategoryByName(name)
    if (!id && categoryExists) {
      throw new ApolloError('Category already exists.', 'ALREADY_EXISTS', { name })
    }

    const uuid = uuidv4()
    const item = {
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
        S: userId.toString()
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
    const pk = id || `Category_${uuid}`

    item.pk = {
      S: pk.toString()
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
      id: pk,
      name,
      parentId,
      description,
      createdBy: userId,
      createdAt: datetime
    }
  }

  async getCategoryByName (name) {
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
      const { pk, data, parentId, description, createdBy, datetime } = category
      return {
        id: pk.S,
        name: data && data.S,
        parentId: parentId && parentId.S,
        description: description && description.S,
        createdBy: createdBy && createdBy.S,
        createdAt: datetime
      }
    }
  }

  async getCategoryById (id) {
    // Check valid some attribute that requires input
    if (!id) {
      throw new UserInputError('Invalid category id', { id })
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
      const { pk, data, parentId, description, createdBy, datetime } = category
      return {
        id: pk.S,
        name: data && data.S,
        parentId: parentId && parentId.S,
        description: description && description.S,
        createdBy: createdBy && createdBy.S,
        createdAt: datetime && datetime.S
      }
    }
  }

  async getCategories ({ filter, limit, nextToken }) {
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
          S: 'CATEGORY_DETAIL'
        }
      },
      ScanIndexForward: false,
      Limit: limit
    }
    if (nextToken) {
      param.ExclusiveStartKey = JSON.parse(encodeBase64(nextToken))
    }
    const results = await db.query(param)

    if (results && results.Items && results.Items.length > 0) {
      const categories = results.Items.map(category => {
        const { pk, data, parentId, description, createdBy, datetime } = category

        return {
          id: pk.S,
          name: data && data.S,
          parentId: parentId && parentId.S,
          description: description && description.S,
          createdBy: createdBy && createdBy.S,
          createdAt: datetime && datetime.S
        }
      })

      return {
        categories,
        nextToken: decodeBase64(JSON.stringify(results.LastEvaluatedKey)),
        count: results.Count
      }
    }
  }

  async deleteCategory (id) {
    // Check valid some attribute that requires input
    if (!id) {
      throw new UserInputError('Invalid category id', { id })
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

      const { Attributes: { pk, data, parentId, description, createdBy, datetime } } = category

      return {
        id: pk.S,
        name: data && data.S,
        parentId: parentId && parentId.S,
        description: description && description.S,
        createdBy: createdBy && createdBy.S,
        createdAt: datetime && datetime.S
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
