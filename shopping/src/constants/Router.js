const rootRouter = '/api/v1'

const ROUTER = {
  AUTH_REGITER: `${rootRouter}/auth/regiter`,
  AUTH_LOGIN: `${rootRouter}/auth/login`,
  AUTH_LOGOUT: `${rootRouter}/auth/logout`,
  PRODUCTS: `${rootRouter}/products`,
  PRODUCTS_ID: `${rootRouter}/products/:id`,
  PRODUCTS_BY_CATEGORY_ID: `${rootRouter}/category/:categoryId/products`
}

module.exports = ROUTER
