export function authUser(username: string, id : number) {
  const userData = { username: username, userID : id };
  localStorage.setItem('user', JSON.stringify(userData));
}

export default authUser;
