export function setName(name) {
  window.localStorage.setItem('userName', name);
}

export function getName() {
  return window.localStorage.getItem('userName');
}
