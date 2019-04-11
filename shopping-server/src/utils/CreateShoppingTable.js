import { dynamoDB } from './DynamoConfig.js'

const tableName = 'Shopping'

const productTable = {
  TableName: tableName,
  KeySchema: [
    { AttributeName: 'pk', KeyType: 'HASH' }, // Partition key
    { AttributeName: 'sk', KeyType: 'RANGE' } // Sort key
  ],
  AttributeDefinitions: [
    { AttributeName: 'pk', AttributeType: 'S' },
    { AttributeName: 'sk', AttributeType: 'S' },
    { AttributeName: 'data', AttributeType: 'S' },
    { AttributeName: 'datetime', AttributeType: 'S' }
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: 'GSI_1',
      KeySchema: [
        { AttributeName: 'sk', KeyType: 'HASH' }, // Partition key
        { AttributeName: 'data', KeyType: 'RANGE' } // Sort key
      ],
      Projection: {
        ProjectionType: 'INCLUDE , datetime, name, price, description, amount, photos, discount, address, role, username, phone, name'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    },
    {
      IndexName: 'GSI_2',
      KeySchema: [
        { AttributeName: 'datetime', KeyType: 'HASH' }, // Partition key
        { AttributeName: 'sk', KeyType: 'RANGE' } // Sort key
      ],
      Projection: {
        ProjectionType: 'KEYS_ONLY'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1
  }
}

dynamoDB.createTable(productTable, (err, data) => {
  if (err) {
    console.error('Unable to create table Shopping. Error JSON:', JSON.stringify(err, null, 2))
  } else {
    console.log('Created table shopping. Table description JSON:', JSON.stringify(data, null, 2))
  }
})
