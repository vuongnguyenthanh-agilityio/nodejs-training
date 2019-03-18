const AWS = require('aws-sdk')

AWS.config.update({
  region: 'us-west-2',
  endpoint: 'http://localhost:8000'
})

const dynamodb = new AWS.DynamoDB()

const productTable = {
  TableName: 'Product_Shopping',
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

dynamodb.createTable(productTable, (err, data) => {
  if (err) {
    console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2))
  } else {
    console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2))
  }
})
