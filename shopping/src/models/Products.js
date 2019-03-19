const { documentClient } = require('../config/DynamoDb.js')

const tableName = 'Product_Shopping'

exports.createProduct = (product, callback) => {
  const params = {
    TableName: tableName,
    Item: {
      'id': new Date().getTime().toString(),
      'categoryId': product.categoryId,
      'companyId': product.companyId,
      'name': product.name,
      'price': product.price,
      'photos': product.photos
    }
  }
  documentClient.put(params, callback)
}

exports.getProducts = (callback) => {
  const params = {
    TableName: tableName
  }

  console.log('Scanning Movies table.')
  documentClient.scan(params, callback)
}
