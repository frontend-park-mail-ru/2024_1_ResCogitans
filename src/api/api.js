export async function login(url, body, callback) {
  try {
    const response = await fetch(`${url}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const content = await response.json();
    callback(content);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

export async function signup(url, body, callback) {
  try {
    const response = await fetch(`${url}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const content = await response.json();
    callback(content);
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
}

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
