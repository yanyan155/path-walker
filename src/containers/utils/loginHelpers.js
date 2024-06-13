import { setName } from './sessionStorageHelper';

export default async function loginSubmit(event, setError, name, password) {
  event.preventDefault();

  setName(name);

  const data = {
    name,
    password,
  };

  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  });

  if (response.status === 200) {
    window.location.href = '/';
  } else {
    const data = await response.text();
    setError(response.status, data);
  }
}
