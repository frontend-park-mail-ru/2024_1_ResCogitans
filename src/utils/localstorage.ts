export function userHelper(method : string, username? : string) {
  if (method === 'get') {
    return localStorage.getItem('username');
  } if (method === 'set' && username !== undefined) {
    localStorage.setItem('username', username);
  } else if (method === 'remove') {
    localStorage.removeItem('username');
  }
  return null;
}

export default userHelper;
