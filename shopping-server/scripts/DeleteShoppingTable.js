import { dynamoDB } from './DynamoConfig.js'

var params = {
  TableName: 'Shopping'
}

console.log('Attempting a conditional delete...')
dynamoDB.deleteTable(params, function (err, data) {
  if (err) {
    console.error('Unable to delete Table Shopping. Error JSON:', JSON.stringify(err, null, 2))
  } else {
    console.log('Delete table Shopping succeeded:', JSON.stringify(data, null, 2))
  }
})
