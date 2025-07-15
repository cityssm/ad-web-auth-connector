export interface ADWebAuthConfig {
  method: 'get' | 'headers' | 'post'
  url: string

  passwordField: string
  userNameField: string
}
