const productControler = require('../controllers/Products.js')
const ROUTER = require('../../constants/Router.js')

module.exports = app => {
  app.route(ROUTER.PRODUCTS)
    .post(productControler.createProduct)
    .get(productControler.getProducts)

  app.route(ROUTER.PRODUCTS_BY_CATEGORY_ID)
    .get(productControler.getProductsByCategory)
}
