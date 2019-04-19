import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

/**
* Decode character string to base64
* @param {string} str
* @return {string} string base64
*/
export const decodeBase64 = (str = '') => {
  return Buffer.from(str).toString('base64')
}

/**
* Encode base64 to character string
* @param {string} str
* @return {string}  character is encoded
*/
export const encodeBase64 = (base64Str = '') => {
  return Buffer.from(base64Str, 'base64').toString('ascii')
}

/**
* Encode password
* @param {string} password
* @return {string}  character is encoded
*/
export const encodePassword = (password = '') => {
  const salt = bcrypt.genSaltSync()
  return bcrypt.hashSync(password, salt)
}

/**
* Compare bcrypt string with string normal
* @param {string} bcryptStr
* @param {string} str
* @return {bolean}  true: if they are same
*/
export const isBcryptCompare = async (bcryptStr, str) => {
  const isSame = await bcrypt.compare(str, bcryptStr)
  return isSame
}

/**
* Create token with userId, username and role with json web token
* @param {object} user
* @param {string} secret
* @param {string} expiresIn
* @return {string} json web token
*/
export const createToken = async (user, secret, expiresIn) => {
  const { id, role, username } = user
  const token = await jwt.sign({ id, role, username }, secret, {
    expiresIn
  })
  return token
}

/**
* Verify token by json web token
* @param {string} token
* @param {string} secret
* @return {promise} json web token
*/
export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret)
}
