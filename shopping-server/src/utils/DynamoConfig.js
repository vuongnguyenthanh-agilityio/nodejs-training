import Dynamodb from 'aws-sdk/clients/dynamodb'

const config = {
  region: 'us-east-1',
  endpoint: 'http://localhost:8000'
}

export const documentClient = new Dynamodb.DocumentClient(config)
export const dynamoDB = new Dynamodb(config)
