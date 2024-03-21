/**
* Функция для получения данных о достопримечательностях.
* @async
* @function getSights
* @param {string} url - URL для запроса данных.
* @param {Function} callback - Функция обратного вызова. Она будет вызвана после выполнения запроса.
* @returns {Promise<void>}
*/
const getSights = async (url) => {
  const response = await fetch(url);
  const responseData = await response.json();
  return responseData;
};

export default getSights;
