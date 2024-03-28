/**
* Функция для выполнения входа в систему.
* @async
* @function login
* @param {string} url - URL сервера.
* @param {Object} body - Объект с данными для входа (например, логин и пароль).
* @param {Function} callback - Функция обратного вызова. Она будет вызвана после выполнения запроса.
* @returns {Promise<void>}
*/
export async function login(url : string, body : any): Promise<any> {
  const response = await fetch(`${url}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const responseData = await response.json();
  return { status: response.status, data: responseData };
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
export async function signup( url : string, data : any ): Promise<any> {
  const response = await fetch(`${url}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  return { status: response.status, data: responseData };
}

export async function logout(url : string): Promise<any> {
  const response = await fetch(`${url}/logout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const responseData = await response.json();
  return { status: response.status, data: responseData };
}
