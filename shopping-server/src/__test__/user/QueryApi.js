export const querySignUp = (variables) => ({
  query: `
    mutation signUp($input: SignUpUserInput!){
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

export const querySignIn = (variables) => ({
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

export const queryGetUser = (variables) => ({
  query: `
    query getUser($id: ID!) {
      getUserById(id: $id) {
        id
        username
        role
        phone
        address
      }
    }
  `,
  variables
})
