/**
* Decode chractor string to base64
* @param {string} str
* @return {string} string base64
*/
export const decodeBase64 = (str) => {
  return Buffer.from(str).toString('base64')
}

/**
* Encode base64 to chractor string
* @param {string} str
* @return {string}  chractor string
*/
export const encodeBase64 = (base64Str) => {
  return Buffer.from(base64Str, 'base64').toString('ascii')
}
