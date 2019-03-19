const productControler = require('../controllers/Products.js')
const ROUTER = require('../constants/Router.js')

module.exports = app => {
  app.route(ROUTER.PRODUCTS)
    .post(productControler.createProduct)
    .get(productControler.getProducts)
}
