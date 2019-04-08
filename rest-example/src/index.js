import express from 'express'
import consign from 'consign'
import https from 'https'
import fs from 'fs'
const path = require('path')
process.title = 'myApp'

const app = express()

consign({ verbose: false, cwd: path.join(__dirname) })
  .include('./utils/Authentication.js')
  .then('./utils/Middlewares.js')
  .then('./api/routes')
  .into(app)

// Use HTTPS

// if (process.env.NODE_ENV !== 'test') {
//   const credentials = {
//     key: fs.readFileSync('ntask.key', 'utf8'),
//     cert: fs.readFileSync('ntask.cert', 'utf8')
//   }
//   https.createServer(credentials, app)
//     .listen(app.get('port'), () => console.log(`Products API - Port ${app.get('port')}`))
// }

if (process.env.NODE_ENV !== 'test') {
  app.listen(app.get('port'), () => console.log(`Products API - Port ${app.get('port')}`))
}

module.exports = app
