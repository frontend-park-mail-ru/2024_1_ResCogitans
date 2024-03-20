export function validate({string : inputText, type : type }) {
  const emailRegexp = /^(?!.*\s)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const passwordRegexp = /^(?!.*\s)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/;
  const emojiRegexp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])$/;

  switch (type) {
    case 'email':
      if (inputText === "") {
        return 'Введите электронную почту';
      }
      if (!emailRegexp.test(inputText) || emojiRegexp.test(inputText)) {
        return 'Неверный формат электронной почты';
      }
      break;

    case 'password':
    case 'text':
      if (inputText === "") {
        return 'Введите пароль';
      }
      if (!passwordRegexp.test(inputText) || emojiRegexp.test(inputText)) {
        return 'Пароль должен содержать 8-32 символа, включая специальные символы, заглавную букву и цифры';
      }
      break;
  }
}

export default validate;
