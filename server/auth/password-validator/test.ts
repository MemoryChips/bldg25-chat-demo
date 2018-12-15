import { PasswordValidator } from './lib'

const pv = new PasswordValidator('Password10')

const valid: boolean = pv
  .digits()
  .max(12)
  .not()
  .spaces()
  .symbols()
  .has()
  .uppercase()
  .lowercase()
  .isValid()

console.log(valid)
