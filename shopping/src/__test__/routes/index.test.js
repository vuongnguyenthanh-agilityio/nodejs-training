/* eslint-disable no-undef */

// describe('Hello World', () => {
//   beforeAll(() => {
//   // do something before anything else runs
//     console.log('Jest starting!')
//   })
//   // close the server after each test
//   afterAll(() => {
//     console.log('server closed!')
//   })
//   it('get home route GET /', async () => {
//     // const response = await request(server).get('/')
//     expect('Hello World! 123456').toContain('Hello World!')
//   })
// })

beforeAll(() => {
  // do something before anything else runs
  console.log('Jest starting!')
})
// close the server after each test
afterAll(() => {
  console.log('server closed!')
})

test('string returning hello', () => {
  expect('hello there jest').toMatch('hello there jest')
})
