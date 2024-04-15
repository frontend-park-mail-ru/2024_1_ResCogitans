export async function validate( inputText : string, type : string ): Promise<void> {
  return new Promise((resolve, reject) => {
    const emailRegexp = /^(?!.*\s)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordRegexp = /^(?!.*\s)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/;
    const emojiRegexp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])$/;

    switch (type) {
      case 'email':
        if (inputText === '') {
          reject(new Error('Введите электронную почту'));
        } else if (!emailRegexp.test(inputText) || emojiRegexp.test(inputText)) {
          reject(new Error('Неверный формат электронной почты'));
        } else {
          resolve();
        }
        break;

      case 'password':
      case 'text':
        if (!passwordRegexp.test(inputText) || emojiRegexp.test(inputText)) {
          reject(new Error('Пароль должен содержать 8-32 символа, включая специальные символы, заглавную букву и цифры'));
        } else {
          resolve();
        }
        break;
    }
  });
}

export default validate;
