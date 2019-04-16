import axios from 'axios'

const API_URL = 'http://localhost:9000/graphql'

export const signIn = async variables => {
  console.log('variables: ', variables)
  try {
    const results = await axios.post(API_URL, {
      query: `
      mutation signIn($username: String!, $password: String!) {
        signIn(username: $username, password: $password) {
          token
          user {
            id
            role
            username
          }
        }
      }
    `,
      variables
    })
    return results
  } catch (error) {
    throw new Error(error)
  }
}

export const signUp = async variables => {
  console.log('variables: ', variables)
  try {
    const results = await axios.post(API_URL, {
      query: `
      mutation signUp($input: CreateUserInput!){
        signUp(input: $input) {
          token
          user {
            id
            username
            role
          }
        }
      }
    `,
      variables
    })
    return results
  } catch (error) {
    throw new Error(error)
  }
}
