export async function deleteFileAjax(path, isDirectory) {
  const data = {
    path,
    isDirectory,
  };
  const response = await fetch('/deleteFile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(data),
  });

  if (response.status === 200) {
    alert('file successfully deleted');
  } else {
    alert('some error occurs');
  }
}

export async function getDetails(
  path,
  fileId,
  updateDetailsSuccess,
  updateDetailsError
) {
  try {
    const json = await fetch(path);
    const data = await json.json();
    updateDetailsSuccess(fileId, data.size, data.type, data.modifiedDate);
  } catch (err) {
    updateDetailsError(fileId);
  }
}
