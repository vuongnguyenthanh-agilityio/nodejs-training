const Dynamodb = require('aws-sdk/clients/dynamodb')

const config = {
  region: 'us-east-1',
  endpoint: 'http://localhost:8000'
}

const documentClient = new Dynamodb.DocumentClient(config)
const dynamoDB = new Dynamodb(config)

module.exports = { documentClient, dynamoDB }
