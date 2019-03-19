const rootRouter = '/api/v1'

const ROUTER = {
  PRODUCTS: `${rootRouter}/products`,
  PRODUCTS_ID: `${rootRouter}/products/:id`,
  PRODUCTS_BY_CATEGORY_ID: `${rootRouter}/category/:categoryId/products`
}

module.exports = ROUTER
