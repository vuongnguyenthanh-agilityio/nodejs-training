import { UserInputError, ApolloError } from 'apollo-server'
import uuidv4 from 'uuid/v4'

import Database from '../db'
import { encodeBase64, decodeBase64 } from '../utils/Utilties'

const tableName = process.env.NODE_ENV === 'test' ? 'Shopping_Test' : 'Shopping'
const globalIndexTwo = 'GSI_2'

export default class CategoryModel {
  async putProduct (product) {
    const { name, categoryId, price, description, amount, photos, userId, discount, datetime, status, id } = product
    // Check valid some attribute that requires input
    if (!name || !categoryId) {
      throw new UserInputError('Form input invalid.', { product })
    }

    const uuid = uuidv4()
    const item = {
      sk: {
        S: 'PRODUCT_DETAIL'
      },
      name: {
        S: name.toString()
      },
      data: {
        S: categoryId.toString()
      },
      price: {
        N: price ? price.toString() : '0'
      },
      amount: {
        N: amount ? amount.toString() : '0'
      },
      discount: {
        N: discount ? discount.toString() : '0'
      },
      createdBy: {
        S: userId.toString()
      },
      status: {
        S: status ? status.toString() : 'PENDING'
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

    if (photos) {
      item.photos = {
        L: photos
      }
    }

    const pk = id || `Product_${uuid}`

    item.pk = {
      S: pk.toString()
    }

    const itemUserId = {
      ...item,
      sk: {
        S: `PRODUCT_DETAIL_${userId}`
      }
    }

    const db = await this.getDatabase()
    try {
      await db.putItem({
        TableName: tableName,
        Item: item
      })

      await db.putItem({
        TableName: tableName,
        Item: itemUserId
      })
    } catch (error) {
      throw new Error(error)
    }
    return {
      id: pk,
      name,
      categoryId,
      description,
      status,
      price: price || 0,
      amount: amount || 0,
      discount: discount || 0,
      createdBy: userId,
      createdAt: datetime
    }
  }

  async getProductById (id) {
    // Check valid some attribute that requires input
    if (!id) {
      throw new UserInputError('Invalid product id', { id })
    }
    const db = await this.getDatabase()
    const param = {
      TableName: tableName,
      Key: {
        pk: {
          S: id.toString()
        },
        sk: {
          S: 'PRODUCT_DETAIL'
        }
      }
    }
    const results = await db.getItem(param)

    if (results && results.Item) {
      const product = results.Item
      const { pk, data, name, price, description, amount, photos, createdBy, discount, datetime, status, confirmedBy } = product
      return {
        id: pk.S,
        categoryId: data && data.S,
        name: name && name.S,
        price: price && price.N,
        amount: amount && amount.N,
        discount: discount && discount.N,
        createdAt: datetime && datetime.S,
        status: status && status.S,
        photos: photos && photos.L,
        description: description && description.S,
        createdBy: createdBy && createdBy.S,
        confirmedBy: confirmedBy && confirmedBy.S
      }
    }
  }

  async updateStatusProduct ({ id, status, datetime, userId }) {
    // Check valid some attribute that requires input
    if (!id || !status) {
      throw new UserInputError('Invalid product id', { id, status })
    }

    const product = await this.getProductById(id)
    if (!product) {
      throw new ApolloError('Product not exists')
    }

    const db = await this.getDatabase()
    const param = {
      TableName: tableName,
      Key: {
        pk: {
          S: id.toString()
        },
        sk: {
          S: 'PRODUCT_DETAIL'
        }
      },
      ExpressionAttributeNames: {
        '#status': 'status',
        '#confirmedAt': 'confirmedAt'
      },
      ExpressionAttributeValues: {
        ':status': { S: status.toString() },
        ':datetime': { S: datetime.toString() },
        ':createdBy': { S: userId.toString() }
      },
      UpdateExpression: 'SET #status = :status, #confirmedAt = :datetime, confirmedBy = :createdBy',
      ReturnValues: 'ALL_NEW'
    }
    const param1 = {
      ...param,
      Key: {
        ...param.Key,
        sk: {
          S: `PRODUCT_DETAIL_${userId}`
        }
      }
    }
    const results = await db.updateItem(param)
    await db.updateItem(param1)

    const { Attributes:
      { pk, data, name, price, description, amount, photos, createdBy, discount, datetime: resDatetime, status: resStatus, confirmedBy, confirmedAt }
    } = results
    return {
      id: pk.S,
      categoryId: data && data.S,
      name: name && name.S,
      price: price && price.N,
      amount: amount && amount.N,
      discount: discount && discount.N,
      createdAt: resDatetime && resDatetime.S,
      status: resStatus && resStatus.S,
      photos: photos && photos.L,
      description: description && description.S,
      createdBy: createdBy && createdBy.S,
      confirmedBy: confirmedBy && confirmedBy.S,
      confirmedAt: confirmedAt && confirmedAt.S
    }
  }

  async getProducts ({ filter = {}, limit, nextToken, userId }) {
    const { categoryId, status } = filter
    const db = await this.getDatabase()
    const partitionKey = userId ? `PRODUCT_DETAIL_${userId}` : 'PRODUCT_DETAIL'

    const param = {
      TableName: tableName,
      IndexName: globalIndexTwo,
      KeyConditionExpression: '#pk = :pk',
      ExpressionAttributeNames: {
        '#pk': 'sk'
      },
      ExpressionAttributeValues: {
        ':pk': {
          S: partitionKey
        }
      },
      ScanIndexForward: false,
      Limit: limit
    }

    let filterExpression = ''

    // Add filter by categoryId if have categoryId
    if (categoryId) {
      param.ExpressionAttributeValues[':categoryId'] = {
        S: categoryId
      }
      param.ExpressionAttributeNames['#data'] = 'data'
      filterExpression = '#data = :categoryId'
    }

    // Add filter by status if have categoryId
    if (status) {
      param.ExpressionAttributeValues[':status'] = {
        S: status
      }
      param.ExpressionAttributeNames['#status'] = 'status'
      filterExpression = filterExpression ? `${filterExpression} AND #status = :status` : '#status = :status'
    }

    // Add FilterExpression to param If exists any filter
    if (filterExpression) {
      param.FilterExpression = filterExpression
    }

    // encode nextToken
    if (nextToken) {
      param.ExclusiveStartKey = JSON.parse(encodeBase64(nextToken))
    }
    const results = await db.query(param)

    if (results && results.Items && results.Items.length > 0) {
      const products = results.Items.map(product => {
        const { pk, data, name, price, description, amount, photos, createdBy, discount, datetime, status, confirmedAt, confirmedBy } = product
        return {
          id: pk.S,
          categoryId: data && data.S,
          name: name && name.S,
          price: price && price.N,
          amount: amount && amount.N,
          discount: discount && discount.N,
          lastUpdate: datetime && datetime.S,
          status: status && status.S,
          photos: photos && photos.L,
          description: description && description.S,
          createdBy: createdBy && createdBy.S,
          confirmedAt: confirmedAt && confirmedAt.S,
          confirmedBy: confirmedBy && confirmedBy.S
        }
      })

      return {
        products,
        nextToken: decodeBase64(JSON.stringify(results.LastEvaluatedKey)),
        count: results.Count
      }
    }
  }

  async deleteProduct (id, userId) {
    // Check valid some attribute that requires input
    if (!id || !userId) {
      throw new UserInputError('Invalid product id', { id, userId })
    }
    const db = await this.getDatabase()
    try {
      const product = await db.deleteItem({
        TableName: tableName,
        Key: {
          pk: {
            S: id.toString()
          },
          sk: {
            S: 'PRODUCT_DETAIL'
          }
        },
        ReturnValues: 'ALL_OLD'
      })

      await db.deleteItem({
        TableName: tableName,
        Key: {
          pk: {
            S: id.toString()
          },
          sk: {
            S: `PRODUCT_DETAIL_${userId}`
          }
        }
      })

      const { Attributes: { pk, data, name, price, description, amount, photos, createdBy, discount, datetime, status, confirmedAt, confirmedBy } } = product

      return {
        id: pk.S,
        categoryId: data && data.S,
        name: name && name.S,
        price: price && price.N,
        amount: amount && amount.N,
        discount: discount && discount.N,
        lastUpdate: datetime && datetime.S,
        status: status && status.S,
        photos: photos && photos.L,
        description: description && description.S,
        createdBy: createdBy && createdBy.S,
        confirmedAt: confirmedAt && confirmedAt.S,
        confirmedBy: confirmedBy && confirmedBy.S
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
