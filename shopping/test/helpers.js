const supertest = require('supertest')
const chai = require('chai')
const app = require('../src/index.js')
console.log('Helpers CCC')
global.app = app
global.request = supertest(app)
global.expect = chai.expect
