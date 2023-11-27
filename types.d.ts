export interface ADWebAuthConfig {
    url: string;
    method: 'get' | 'post' | 'headers';
    userNameField: string;
    passwordField: string;
}
