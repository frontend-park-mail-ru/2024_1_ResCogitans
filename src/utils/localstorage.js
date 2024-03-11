export function userHelper(method, username) {
    if (method == 'get') {
      return localStorage.getItem('username');
    } else if (method == 'set') {
      localStorage.setItem('username', username);
    } else if (method == 'remove') {
        localStorage.removeItem('username');
    }
}

export default userHelper;

