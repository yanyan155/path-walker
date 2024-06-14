export const setLoginError = (status, responseText) => ({
  type: 'SET_LOGIN_ERROR',
  status,
  responseText,
});

export const setPathApp = path => ({
  type: 'SET_PATH_APP',
  path,
});

export const setFilesApp = files => ({
  type: 'SET_FILES_APP',
  files,
});

export const updateFilesApp = data => ({
  type: 'UPDATE_FILES_APP',
  data,
});

export const setFilesTextApp = fileText => ({
  type: 'SET_FILES_TEXT_APP',
  fileText,
});

export const setIsErrorApp = isErrorApp => ({
  type: 'SET_IS_ERROR_APP',
  isErrorApp,
});

export const setUsersApp = users => ({
  type: 'SET_USERS_APP',
  users,
});

export const setIsAdminApp = isAdmin => ({
  type: 'SET_IS_ADMIN',
  isAdmin,
});

export const updateDetailsSuccessItem = (absolutePath, size, type, date) => {
  return {
    type: 'UPDATE_DETAILS_SUCCESS_ITEM',
    size,
    fileType: type,
    date,
    absolutePath,
    isLoaded: true,
  };
};

export const updateDetailsErrorItem = absolutePath => ({
  type: 'UPDATE_DETAILS_ERROR_ITEM',
  absolutePath,
  isLoaded: true,
});

export const setSortFiles = (prevType, currentType) => ({
  type: 'SET_SORT_TYPE',
  sortType: resolveSortType(prevType, currentType),
});

export const setFilterFiles = filterValue => ({
  type: 'SET_FILTER',
  filterValue,
});

function resolveSortType(prev, current) {
  if (prev === current) {
    if (current.includes('_REVERT')) {
      return current.slice(0, -7);
    } else {
      return `${current}_REVERT`;
    }
  }
  return current;
}
