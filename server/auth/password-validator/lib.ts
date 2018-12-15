const regex = {
  digits: /\d+/,
  letters: /[a-zA-Z]+/,
  uppercase: /[A-Z]+/,
  lowercase: /[a-z]+/,
  symbols: /[`~\!@#\$%\^\&\*\(\)\-_\=\+\[\{\}\]\\\|;:'",<.>\/\?€£¥₹]+/,
  spaces: /[\s]+/
}

export class PasswordValidator {
  private _not = false
  private _errors: string[] = []

  constructor(private password: string) {}

  private _setValid(b: boolean, errMsg: string): PasswordValidator {
    if (b === this._not) {
      this._errors.push(`password must${this._not ? ' ' : ' not '} ${errMsg}`)
    }
    return this
  }

  private _process(regexp: RegExp, errMsg: string): PasswordValidator {
    return this._setValid(new RegExp(regexp).test(this.password), errMsg)
  }

  not() {
    this._not = true
    return this
  }

  has() {
    this._not = false
    return this
  }

  isValid() {
    return this._errors.length === 0
  }

  errors() {
    return this._errors
  }

  min(num: number) {
    return this._setValid(this.password.length >= num, `have a min length of ${num}`)
  }

  max(num: number) {
    return this._setValid(this.password.length <= num, `have a length over ${num}`)
  }

  digits() {
    return this._process(regex.digits, 'have digits')
  }

  letters() {
    return this._process(regex.letters, 'have letters')
  }

  uppercase() {
    return this._process(regex.uppercase, 'contain an uppercase letter')
  }

  lowercase() {
    return this._process(regex.lowercase, 'contain a lowercase letter')
  }

  symbols() {
    return this._process(regex.symbols, 'contain a symbol')
  }

  spaces() {
    return this._process(regex.spaces, 'one or more spaces')
  }

  oneOf(list: string[]) {
    return this._setValid(list.indexOf(this.password) >= 0, 'be on the list of passwords')
  }
}
