import { AbstractControl, ValidationErrors } from '@angular/forms'

export class SignupValidators {
  static cannotContainSpace(control: AbstractControl): ValidationErrors | null {
    if ((control.value as string).indexOf(' ') === -1) {
      return null
    }
    return { cannotContainSpace: true }
  }
  static shouldBeUniqueUserName(
    control: AbstractControl
  ): Promise<ValidationErrors | null> {
    return new Promise<ValidationErrors | null>((resolve, _reject) => {
      return setTimeout(() => {
        console.log('ok')
        if ((control.value as string) !== 'mosh') {
          resolve(null)
        } else {
          return resolve({ shouldBeUniqueUserName: true })
        }
      }, 2000)
    })
  }
  static matchPassword(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')
    const confirmPassword = control.get('confirmPassword')
    if (password && confirmPassword) {
      if (password.value !== confirmPassword.value) {
        console.log(`passwords do not match`)
        confirmPassword.setErrors({ matchPassword: true })
      } else {
        console.log(`passwords match`)
        confirmPassword.setErrors({ matchPassword: false })
      }
    }
    return null
  }
}
