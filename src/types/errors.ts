export const signupErrors: { [key: string]: string } = {
  'password is not complex': 'Пароль должен содержать 8-32 символа, включая специальные символы, заглавную букву и цифры',
  'username and password must not be empty': 'Поле логина или пароля не может быть пустым',
  'failed creating new profile': 'Почта уже используется',
};

export const loginErrors: { [key: string] : string } = {
  '400': 'Неверный логин или пароль',
};

export const logoutErrors : { [key: string] : string } = {
  '401': 'Выход из аккаунта уже был выполнен ранее',
};
