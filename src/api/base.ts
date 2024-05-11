import { ENV_CONFIG } from '../../envConfig';


/**
* Функция для выполнения GET запроса к указанному URL.
* @async
* @function get
* @param {string} url - URL для запроса данных.
* @returns {Promise<void>}
*/
export async function get( endpoint : string, body? : unknown) : Promise<unknown> {
  const response = await fetch(`${ENV_CONFIG.API_URL}/api/${endpoint}`, {
    body : JSON.stringify(body),
  });
  const responseData = await response.json();
  return {
    data: responseData, status: response.status, 
  };
}


function getCSRFFromCookie() {
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const [key, value] = cookie.split('=');

    if (key === 'CSRFToken') {
      return value;
    }
  }

  return '';
}

export async function post(endpoint : string, body? : unknown): Promise<unknown> {
  const response = await fetch(`${ENV_CONFIG.API_URL}/api/${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
      'X-CSRF-Token': getCSRFFromCookie(),
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const responseData = await response.json();
  return {
    data: responseData, status: response.status, 
  };
}


export default {
  get, post, 
};



