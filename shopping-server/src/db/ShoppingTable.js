
const tableName = process.env.NODE_ENV === 'test' ? 'Shopping_Test' : 'Shopping'

export default {
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
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      }
    },
    {
      IndexName: 'GSI_2',
      KeySchema: [
        { AttributeName: 'sk', KeyType: 'HASH' }, // Partition key
        { AttributeName: 'datetime', KeyType: 'RANGE' } // Sort key
      ],
      Projection: {
        ProjectionType: 'ALL'
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
