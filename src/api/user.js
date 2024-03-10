/**
* Функция для выполнения входа в систему.
* @async
* @function login
* @param {string} url - URL сервера.
* @param {Object} body - Объект с данными для входа (например, логин и пароль).
* @param {Function} callback - Функция обратного вызова. Она будет вызвана после выполнения запроса.
* @returns {Promise<void>}
*/
export async function login(url, body, callback) {
  try {
    const response = await fetch(`${url}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    callback(data, null);
  } catch (error) {
    console.error('Error: ', error);
  }
}

/**
* Функция для регистрации нового пользователя.
* @async
* @function signup
* @param {string} url - URL сервера.
* @param {Object} body - Объект с данными для регистрации (например, логин и пароль).
* @param {Function} callback - Функция обратного вызова. Она будет вызвана после выполнения запроса.
* @returns {Promise<void>}
*/
export async function signup(url, body, callback) {
  try {
    const response = await fetch(`${url}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    callback(data);
  } catch (error) {
    console.error('Error: ', error);
  }
}
