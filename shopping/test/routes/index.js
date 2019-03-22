
describe('Routes: Index', () => {
  describe('GET /', () => {
    it('returns the API status', done => {
      console.log('request AAAA')
      request.get('/')
        .expect(200)
        .end((err, res) => {
          const expected = { status: 'Products Api' }
          expect(res.body).to.eql(expected)
          done(err)
        })
    })
  })
})
