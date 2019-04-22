import supertest from 'supertest'

const API_URL = 'http://localhost:4000/graphql'
console.log('API_URL: ', API_URL)

const resquest = supertest(API_URL)
