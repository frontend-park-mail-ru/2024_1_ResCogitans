const loginButton = document.getElementById("button-login");
const loginContainer = document.getElementById('login-container');
let loginForm = loginContainer.querySelector('#login-form');
let formState = 'login';

function createLoginForm() {
    const form = document.createElement('div');
    form.id = 'login-form';
    form.style.display = 'flex';
    form.innerHTML = `<h2>Войти</h2>
    <form method="post">
        <input type="email" placeholder="Электронная почта">
        <input type="password" placeholder="Пароль">
        <button id="login-button" type="submit">Войти</button>
        <button id="register-button">Зарегистрироваться</button>
    </form>`;
    return form;
}

function createRegistrationForm() {
    const form = document.createElement('div');
    form.id = 'login-form';
    form.innerHTML = `<h2>Зарегистрироваться</h2>
    <form method="post">
        <input type="email" placeholder="Электронная почта">
        <input type="password" placeholder="Пароль">
        <input type="password" placeholder="Повторите пароль">
        <button id="register-button" type="submit">Зарегистрироваться</button>
    </form>`;
    return form;
}

loginButton.addEventListener("click", (e) => {
    if (!loginForm) {
        loginForm = createLoginForm();
        loginContainer.appendChild(loginForm);
        formState = 'login';
    } else {
        if (formState === 'register') {
            loginForm.innerHTML = createLoginForm().innerHTML;
            formState = 'login'; 
        } else {
            if (loginForm.style.display === 'flex') {
                loginForm.style.display = "none";
            } else {
                loginForm.style.display = "flex";
            }
        }  
    }
}, false);

loginContainer.addEventListener('click', (e) => {
    if (e.target.id === 'register-button') {
        if (formState === 'login') {
            loginForm.innerHTML = createRegistrationForm().innerHTML;
            formState = 'register'; 
        } 
        loginForm.style.display = "flex";
    }
}, false);

loginContainer.addEventListener('submit', (e) => {
    e.preventDefault(); 
    alert('Форма отправлена!'); 
}, false);