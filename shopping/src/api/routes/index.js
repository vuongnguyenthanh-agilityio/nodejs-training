/**
* @api {get} / API Status
* @apiGroup Status
* @apiSuccess {String} status API Status' message
* @apiSuccessExample {json} Success
* HTTP/1.1 200 OK
* {"status": "Products Api"}
*/
module.exports = app => {
  app.get('/', (req, res) => {
    res.status(200).json({ status: 'Products Api' })
  })
}
