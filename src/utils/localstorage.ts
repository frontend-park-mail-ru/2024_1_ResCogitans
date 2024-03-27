export function userHelper(method, username) {
  if (method === 'get') {
    return localStorage.getItem('username');
  } if (method === 'set') {
    localStorage.setItem('username', username);
  } else if (method === 'remove') {
    localStorage.removeItem('username');
  }
  return null;
}

export default userHelper;
