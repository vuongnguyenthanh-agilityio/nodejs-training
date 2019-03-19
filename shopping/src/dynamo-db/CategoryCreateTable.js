const { dynamoDB } = require('../config/DynamoDb.js')

const productTable = {
  TableName: 'Category_Shopping',
  KeySchema: [
    { AttributeName: 'id', KeyType: 'HASH' } // Partition key
  ],
  AttributeDefinitions: [
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
