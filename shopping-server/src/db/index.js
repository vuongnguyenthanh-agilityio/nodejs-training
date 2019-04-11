import DynamoDB from 'aws-sdk/clients/dynamodb'
import ShoppingTable from './ShoppingTable'

export default class Database {
  async connect () {
    if (!this.connection) {
      const params = {
        endpoint: 'http://localhost:8000',
        region: 'local',
        accessKeyId: 'local',
        secretAccessKey: 'local'
      }

      this.connection = new DynamoDB(params)
      await this.createTable(ShoppingTable)
    }

    return this.connection
  }

  async putItem (params) {
    return new Promise((resolve, reject) => {
      this.connection.putItem(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  async getItem (params) {
    return new Promise((resolve, reject) => {
      this.connection.getItem(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  async updateItem (params) {
    return new Promise((resolve, reject) => {
      this.connection.updateItem(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  async scan (params = {}) {
    return new Promise((resolve, reject) => {
      this.connection.scan(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  async deleteItem (params) {
    return new Promise((resolve, reject) => {
      this.connection.deleteItem(params, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  async createTable (table) {
    await new Promise((resolve, reject) => {
      this.connection.createTable(table, (err) => {
        if (err) {
          if (err.code !== 'ResourceInUseException') {
            console.dir(err)
            reject(err)
          } else {
            console.dir(`Table "${table.TableName}" exists`)
            resolve()
          }
        } else {
          console.dir(`Created table "${table.TableName}"`)
          resolve()
        }
      })
    })
  }
}
