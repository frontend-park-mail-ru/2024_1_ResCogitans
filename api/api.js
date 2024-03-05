async function get(url, callback) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        callback(result);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

export { get };