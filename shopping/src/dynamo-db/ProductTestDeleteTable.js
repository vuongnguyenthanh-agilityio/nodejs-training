const { dynamoDB } = require('../config/DynamoDb.js')

var params = {
  TableName: 'Product_Shopping_Test'
}

dynamoDB.deleteTable(params, function (err, data) {
  if (err) {
    console.error('Unable to delete table. Error JSON:', JSON.stringify(err, null, 2))
  } else {
    console.log('Deleted table. Table description JSON:', JSON.stringify(data, null, 2))
  }
})
