import express from 'express'
import consign from 'consign'
const path = require('path')
process.title = 'myApp'

const PORT = 3000
const app = express()

consign({ verbose: false, cwd: path.join(__dirname) })
  .include('./utils/Authentication.js')
  .then('./utils/Middlewares.js')
  .then('./api/routes')
  .into(app)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Products API - Port ${PORT}`))
}

module.exports = app
