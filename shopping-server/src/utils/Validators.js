
/**
* Check validate format email
* @param {string} email
* @return {bolean} true : if it validate
*/
export const isValidateEmail = (email) => {
  let emailPattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

  return emailPattern.test(email)
}

/**
* Check validate format phone number
* @param {string} phoneNumber
* @return {bolean} true : if it validate
*/
export const isValidatePhoneNumber = (phoneNumber) => {
  let phonePattern = /^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/

  return phonePattern.test(phoneNumber)
}
