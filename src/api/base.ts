import { ENV_CONFIG } from '../../envConfig';

/**
* Функция для выполнения GET запроса к указанному URL.
* @async
* @function get
* @param {string} url - URL для запроса данных.
* @returns {Promise<void>}
*/
export async function get( endpoint : string ) : Promise<any> {
  const response = await fetch(`${ENV_CONFIG.API_URL}/${endpoint}`);
  const responseData = await response.json();
  return responseData;
}

export default get;
