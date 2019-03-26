const productControler = require('../controllers/Products.js')
const ROUTER = require('../../constants/Router.js')

module.exports = app => {
  app.route(ROUTER.PRODUCTS)
    .all(app.utils.Authentication.authenticate())
    .post(productControler.createProduct)
    /**
    * @api {get} /api/v1/products Return all products
    * @apiGroup Products
    * @apiHeader {String} Authorization Token of authenticated user
    * @apiHeaderExample {json} Header
    * {"Authorization": "Bearer  xyz.abc.123.hgf"}
    * @apiSuccess {String} id Product id
    * @apiSuccess {String} companyId Product companyId
    * @apiSuccess {String} categoryId Product categoryId
    * @apiSuccess {String} name Product name
    * @apiSuccess {String} price Product price
    * @apiSuccess {Number} photos Product price
    * @apiSuccessExample {json} Success
    * HTTP/1.1 200 OK
    * {
    * "products": [
    *     {
    *         "name": "Samsung S6",
    *         "companyId": "40000",
    *         "id": "1552989110385",
    *         "photos": "https://images.pexels.com/photos/5390/sunset-hands-love-woman.jpg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    *         "categoryId": "88888",
    *         "price": 90000
    *     }
    *   ]
    * }
    * @apiErrorExample {json} Find error
    * HTTP/1.1 401 Unauthorized
    */
    .get(productControler.getProducts)

  app.route(ROUTER.PRODUCTS_BY_CATEGORY_ID)
    // .all(app.utils.Authentication.authenticate())
    .get(productControler.getProductsByCategory)
}
