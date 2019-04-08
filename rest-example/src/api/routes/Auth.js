const userControler = require('../controllers/Auth.js')
const ROUTER = require('../../constants/Router.js')

module.exports = app => {
  app.route(ROUTER.AUTH_REGISTER)
    .post(userControler.register)

  /**
  * @api {post} /api/v1/auth/login Login Api
  * @apiGroup Credentials
  * @apiParam {String} username User email
  * @apiParam {String} password User password
  * @apiParamExample {json} Input
  * {
  * "username": "john@connor.net",
  * "password": "123456"
  * }
  * @apiSuccess {String} token Token of authenticated user
  * @apiSuccessExample {json} Success
  * HTTP/1.1 200 OK
  * {"token": "xyz.abc.123.hgf"}
  * @apiErrorExample {json} Authentication error
  * HTTP/1.1 401 Incorrect password
  */
  app.route(ROUTER.AUTH_LOGIN)
    .post(userControler.login)
}
