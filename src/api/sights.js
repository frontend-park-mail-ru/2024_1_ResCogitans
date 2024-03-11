/**
* Функция для получения данных о достопримечательностях.
* @async
* @function getSights
* @param {string} url - URL для запроса данных.
* @param {Function} callback - Функция обратного вызова. Она будет вызвана после выполнения запроса.
* @returns {Promise<void>}
*/
const getSights = async (url, callback) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    callback(data);
  } catch (error) {
    console.error('Error: ', error);
  }
};

export default getSights;
