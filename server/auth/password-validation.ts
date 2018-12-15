// import passwordValidator from 'password-validator'
// const passwordValidator = require('password-validator')

// // Create a schema
// const schema = new passwordValidator()

// // Add properties to it
// schema
//   .is()
//   .min(4) // Minimum length 10
//   // .has().uppercase()                              // Must have uppercase letters
//   .has()
//   .lowercase() // Must have lowercase letters
//   // .has().digits()                                 // Must have digits
//   .has()
//   .not()
//   .spaces() // Should not have spaces
//   .is()
//   .not()
//   .oneOf(['Passw0rd', 'Password123']) // Blacklist these values

// export function validatePassword(password: string) {
//   return schema.validate(password, { list: true })
// }

import { PasswordValidator } from './password-validator'
export function validatePassword(password: string): string[] {
  return new PasswordValidator(password)
    .max(15)
    .min(4) // Minimum length 4
    .lowercase() // Must have lowercase letters
    .not()
    .spaces() // Should not have spaces
    .oneOf(['Passw0rd', 'Password123']) // Blacklist these values
    .errors()
}
