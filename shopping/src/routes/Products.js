const productControler = require('../controllers/Products.js')
const ROUTER = require('../constants/Router.js')

module.exports = app => {
  app.route(ROUTER.PRODUCTS)
    .post(productControler.createProduct)
    .get((req, res) => {
      res.json({
        products: [
          {
            id: 1,
            name: 'Iphone 7',
            category: 'Phone'
          },
          {
            id: 2,
            name: 'Iphone 10',
            category: 'Phone'
          },
          {
            id: 3,
            name: 'Samsung S9',
            category: 'Phone'
          }
        ]
      })
    })
}
