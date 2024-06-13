export function setName(name) {
  window.sessionStorage.setItem('userName', name);
}

export function getName() {
  return window.sessionStorage.getItem('userName');
}
