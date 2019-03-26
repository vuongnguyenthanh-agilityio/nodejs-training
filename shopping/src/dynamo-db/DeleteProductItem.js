const { documentClient } = require('../config/DynamoDb.js')

var params = {
  TableName: 'Product_Shopping_Test',
  Key: {
    'categoryId': '0001',
    'id': '1553584338555'
  }
  // ConditionExpression: 'info.rating <= :val',
  // ExpressionAttributeValues: {
  //   ':val': 5.0
  // }
}

console.log('Attempting a conditional delete...')
documentClient.delete(params, function (err, data) {
  if (err) {
    console.error('Unable to delete item. Error JSON:', JSON.stringify(err, null, 2))
  } else {
    console.log('DeleteItem succeeded:', JSON.stringify(data, null, 2))
  }
})
