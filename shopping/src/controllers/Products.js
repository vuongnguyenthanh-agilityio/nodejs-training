const productModel = require('../models/Products.js')

exports.createProduct = (req, res) => {
  console.log('reqbody: ', req.body)
  const categoryId = req.body.categoryId
  const companyId = req.body.companyId
  if (!categoryId) {
    res.status(400).json({
      errorCode: 100,
      message: 'Valid categoryId'
    })
  }

  if (!companyId) {
    res.status(400).json({
      errorCode: 200,
      message: 'Valid companyId'
    })
  }
  const product = {
    categoryId: categoryId,
    companyId: companyId,
    name: req.body.name,
    price: req.body.price,
    photos: req.body.photos
  }

  productModel.createProduct(product, (error, data) => {
    if (error) {
      console.log('Error: ', error)
      res.status(304).json({
        errorCode: 300,
        message: error
      })
    } else {
      res.status(201).json({
        products: data
      })
    }
  })
}
