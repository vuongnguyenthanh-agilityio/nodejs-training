const { dynamoDB } = require('../config/DynamoDb.js')
const tableName = 'Product_Shopping_Test'

const productTable = {
  TableName: tableName,
  KeySchema: [
    { AttributeName: 'categoryId', KeyType: 'HASH' }, // Partition key
    { AttributeName: 'id', KeyType: 'RANGE' } // Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: 'categoryId', AttributeType: 'S' },
    { AttributeName: 'id', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 10,
    WriteCapacityUnits: 10
  }
}

dynamoDB.createTable(productTable, (err, data) => {
  if (err) {
    console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2))
  } else {
    console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2))
  }
})
