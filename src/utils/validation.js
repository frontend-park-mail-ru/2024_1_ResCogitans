export function validate(inputText, type) {    
    const emailRegexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const passwordRegexp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,32}$/
    switch(type) {
      case 1://email validation
        if (inputText === "") {
          return "Введите электронную почту";
        } else {
          if (emailRegexp.test(inputText)) {
            console.log("correct");
            return null;
          }
          return "Неверный формат электронной почты";
        }
      case 2: // password validation:
        if (passwordRegexp.test(inputText)) {
          return null;
        }
        return "Пароль должен содержать 8-32 символа, включая специальные символы, заглавную букву и цифры"
    }
    return "Что-то пошло не так" 
  }

  export default validate;