/**
 * Асинхронно выполняет вход пользователя, отправляя POST-запрос на указанный URL.
 * @param {string} url - Базовый URL, к которому будет отправлен запрос.
 * @param {Object} body - Объект, содержащий данные для отправки в теле запроса.
 * @param {function} callback - Функция обратного вызова, которая будет вызвана с результатом запроса.
 */
export async function login(url, body, callback) {
    try {
        const response = await fetch(`${url}/login`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)})
        const content = await response.json();
        callback(content);  
    } catch(error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}


/**
 * Асинхронно регистрирует нового пользователя, отправляя POST-запрос на указанный URL.
 * @param {string} url - Базовый URL, к которому будет отправлен запрос.
 * @param {Object} body - Объект, содержащий данные для отправки в теле запроса.
 * @param {function} callback - Функция обратного вызова, которая будет вызвана с результатом запроса.
 */
export async function signup(url, body, callback) {
    try {
        const response = await fetch(`${url}/signup`, {
            method: 'POST', 
            headers: {'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)})
        const content = await response.json();
        callback(content);  
    } catch(error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

/**
 * Асинхронно выполняет GET-запрос к указанному URL.
 * @param {string} url - URL, к которому будет отправлен запрос.
 * @param {function} callback - Функция обратного вызова, которая будет вызвана с результатом запроса.
 */
async function get(url, callback) {
    try {
        const response = await fetch(url);
        const result = await response.json();
        callback(result);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

export { get };