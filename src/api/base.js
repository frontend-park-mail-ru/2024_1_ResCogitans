/**
* Функция для выполнения GET запроса к указанному URL.
* @async
* @function get
* @param {string} url - URL для запроса данных.
* @param {Function} callback - Функция обратного вызова. Она будет вызвана после выполнения запроса.
* @returns {Promise<void>}
*/
const get = async (url, callback) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    callback(data);
  } catch (error) {
    console.error('Something happened.');
  }
};

export default get;
