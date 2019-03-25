const { documentClient } = require('../../config/DynamoDb.js')

const tableName = process.env.NODE_ENV === 'test' ? 'User_Shopping_Test' : 'User_Shopping'
const globalIndexName = 'UserID_Index'

exports.createUser = (user, callback) => {
  const params = {
    TableName: tableName,
    Item: {
      'id': new Date().getTime().toString(),
      'companyId': user.companyId,
      'username': user.username,
      'name': user.name,
      'password': user.password,
      'address': user.address,
      'photos': user.photos
    }
  }
  documentClient.put(params, callback)
}

exports.getUserByUsername = (username, callback) => {
  var params = {
    TableName: tableName,
    KeyConditionExpression: '#username = :username',
    ExpressionAttributeNames: {
      '#username': 'username'
    },
    ExpressionAttributeValues: {
      ':username': username
    }
  }

  documentClient.query(params, callback)
}

exports.getUserById = (id, callback) => {
  var params = {
    TableName: tableName,
    IndexName: globalIndexName,
    KeyConditionExpression: '#id = :id',
    ExpressionAttributeNames: {
      '#id': 'id'
    },
    ExpressionAttributeValues: {
      ':id': id
    }
  }

  documentClient.query(params, callback)
}
