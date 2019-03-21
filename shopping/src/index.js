import express from 'express'
import consign from 'consign'
const path = require('path')
process.title = 'myApp'

const PORT = 3000
const app = express()

consign({ cwd: path.join(__dirname) })
  .include('./utils/Authentication.js')
  .then('./utils/Middlewares.js')
  .then('./api/routes')
  .into(app)

app.listen(PORT, () => console.log(`Products API - Port ${PORT}`))
