export function addUserToLocalStorage(username: string, id : number) {
  const userData = {
    username: username, userID : id, 
  };
  if (localStorage.getItem('user') !== undefined) {
    localStorage.clear();
  }
  localStorage.setItem('user', JSON.stringify(userData));
}

export default addUserToLocalStorage;
