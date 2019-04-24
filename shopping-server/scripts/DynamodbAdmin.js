import AWS from 'aws-sdk'
import { createServer } from 'dynamodb-admin'
const config = {
  endpoint: 'http://localhost:8000',
  region: 'local',
  accessKeyId: 'local',
  secretAccessKey: 'local'
}
const dynamodb = new AWS.DynamoDB(config)
const dynClient = new AWS.DynamoDB.DocumentClient({ service: dynamodb })

const app = createServer(dynamodb, dynClient)

const port = 8001
const server = app.listen(port)
server.on('listening', () => {
  const address = server.address()
  console.log(`  listening on http://0.0.0.0:${address.port}`)
})
