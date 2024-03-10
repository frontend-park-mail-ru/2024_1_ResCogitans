export async function login(url, body, callback) {
    try {
      const response = await fetch(`${url}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      callback(data, null);
    } catch (error) {
        console.error("Error: ", error);
    }
  }
  
  export async function signup(url, body, callback) {
    try {
      const response = await fetch(`${url}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      callback(data);
    } catch (error) {
        console.error("Error: ", error);
    }
  }
