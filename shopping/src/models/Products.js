const { documentClient } = require('../config/DynamoDb.js')

const tableName = 'Product_Shopping'

exports.createProduct = (product, callback) => {
  var params = {
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
  console.log('Adding a new item...', params)
  documentClient.put(params, callback)
}
