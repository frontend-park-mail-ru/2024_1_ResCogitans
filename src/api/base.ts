/**
* Функция для выполнения GET запроса к указанному URL.
* @async
* @function get
* @param {string} url - URL для запроса данных.
* @param {Function} callback - Функция обратного вызова. Она будет вызвана после выполнения запроса.
* @returns {Promise<void>}
*/
const get = async ( url : string ) => {
  const response = await fetch(url);
  const responseData = await response.json();
  return responseData;
};

export default get;
