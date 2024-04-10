import { ENV_CONFIG } from '../../envConfig';

/**
* Функция для выполнения GET запроса к указанному URL.
* @async
* @function get
* @param {string} url - URL для запроса данных.
* @returns {Promise<void>}
*/
export async function get( endpoint : string, body? : unknown) : Promise<unknown> {
  const response = await fetch(`${ENV_CONFIG.API_URL}/${endpoint}`, {
    body : JSON.stringify(body),
  });
  const responseData = await response.json();
  return { data: responseData, status: response.status };
}


export async function post(endpoint : string, body? : unknown): Promise<unknown> {
  const response = await fetch(`${ENV_CONFIG.API_URL}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  const responseData = await response.json();
  console.log(responseData);
  return { data: responseData, status: response.status };
}


export default { get, post };


