const userControler = require('../controllers/Auth.js')
const ROUTER = require('../../constants/Router.js')

module.exports = app => {
  app.route(ROUTER.AUTH_REGISTER)
    .post(userControler.register)

  app.route(ROUTER.AUTH_LOGIN)
    .post(userControler.login)
}
