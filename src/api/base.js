/**
* Функция для выполнения GET запроса к указанному URL.
* @async
* @function get
* @param {string} url - URL для запроса данных.
* @param {Function} callback - Функция обратного вызова, которая будет вызвана после выполнения запроса.
* @returns {Promise<void>}
*/
export async function get(url, callback) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    callback(data);
  } catch (error) {
    console.error('Something happened.');
  }
}