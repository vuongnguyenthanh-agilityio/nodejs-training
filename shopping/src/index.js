import express from 'express'
import consign from 'consign'

const PORT = 3000
const app = express()

consign()
  .include('./src/utils/Middlewares.js')
  .then('./src/api/routes')
  .into(app)

app.listen(PORT, () => console.log(`Products API - Port ${PORT}`))
