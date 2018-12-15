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
