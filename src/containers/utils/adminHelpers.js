export function findUpdatedUsers(users, newUsers) {
  return newUsers.filter(el => {
    const oldUser = users.find(elem => elem.name === el.name);
    return !(oldUser.isAdmin === el.isAdmin);
  });
}

export function addFileClick(
  event,
  path,
  fileNameRef,
  fileTextRef,
  isDirCheckboxRef,
  createFileAjax
) {
  event.preventDefault();
  const fileNameVal = fileNameRef.current.value;
  const fileTextVal = fileTextRef.current.value;
  const isDirCheckbox = isDirCheckboxRef.current.checked;
  const data = {
    isDirectory: isDirCheckbox,
    text: fileTextVal,
    path: `${path}/${fileNameVal}`,
  };
  createFileAjax(data, fileNameRef, fileTextRef, isDirCheckboxRef);
}

export async function createFileAjax(
  data,
  fileNameRef,
  fileTextRef,
  isDirCheckboxRef
) {
  const response = await fetch('/createFile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  });

  if (response.status === 200) {
    alert('file successfully added');
    fileNameRef.current.value = '';
    fileTextRef.current.value = '';
    isDirCheckboxRef.current.checked = false;
  } else {
    let error = await response.json();
    alert(error);
  }
}

export async function receiveUsers(setUsers) {
  const response = await fetch('/receiveUsers');
  const result = await response.json();
  if (response.status === 200) {
    setUsers(result);
  } else {
    alert('some error occurs');
  }
}

export function updateRolesSubmit(
  event,
  findUpdatedUsers,
  users,
  localUsers,
  updateRolesAjax
) {
  event.preventDefault();
  const updatedUsers = findUpdatedUsers(users, localUsers);
  if (updatedUsers.length > 0) {
    const data = {
      users: JSON.stringify(updatedUsers),
    };
    updateRolesAjax(data);
  }
}

export async function updateRolesAjax(data) {
  const response = await fetch('/updateRoles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  });

  if (response.status === 200) {
    alert('roles updates!');
  } else {
    let error = await response.json();
    alert(error);
  }
}
