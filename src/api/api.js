export async function login(url, body, callback) {
    const response = await fetch(`${url}/login`, {
        method: 'POST', 
        headers: {'Content-Type': 'application/json',
    },
    body: JSON.stringify(body)})
    .then(response => response.json());
    window.history.back();
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