import { v4 as uuidv4 } from 'uuid';

export function createSocket(setUsers, updateFiles, transformFilesArr, path) {
  const ws = new WebSocket('ws://localhost:8079');

  ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.updateType === 'reloadPage') {
      alert(
        'Your role is updated so please relogin and enjoy your new status! ' +
          'You will redirect to login page'
      );
      window.location.reload();
    } else if (data.updateType === 'updateRoles') {
      setUsers(data.users);
    } else if (
      (data.updateType === 'deleted' || data.updateType === 'added') &&
      data.path === path
    ) {
      if (data.updateType === 'added') {
        const newFileArr = transformFilesArr([data.name], data.path, uuidv4);
        data.file = newFileArr[0];
      }
      updateFiles(data);
    }
  };

  ws.onclose = function () {
    ws.close();
    reconnect();
  };

  function reconnect() {
    setTimeout(() => {
      createSocket(setUsers, updateFiles, transformFilesArr, path);
    }, 3000);
  }
}

export function transformFilesArr(files, newPath, uuidv4) {
  return files.map(el => {
    const absolutePath = newPath === '/' ? `${el}` : `${newPath}/${el}`;
    const isLoaded = newPath === '/' ? true : false;
    const type = newPath === '/' ? 'disk' : 'directory';

    return {
      lazyLoadId: uuidv4(),
      fileId: uuidv4(),
      name: el,
      absolutePath,
      size: 0,
      type,
      date: 0,
      isError: false,
      isLoaded,
    };
  });
}
