const productControler = require('../controllers/Products.js')
const ROUTER = require('../../constants/Router.js')

module.exports = app => {
  app.route(ROUTER.PRODUCTS)
    .all(app.utils.Authentication.authenticate())
    .post(productControler.createProduct)
    .get(productControler.getProducts)

  app.route(ROUTER.PRODUCTS_BY_CATEGORY_ID)
    // .all(app.utils.Authentication.authenticate())
    .get(productControler.getProductsByCategory)
}
