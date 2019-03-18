module.exports = app => {
  app.get('/products', (req, res) => {
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
