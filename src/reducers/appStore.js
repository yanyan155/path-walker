import config from '../../config';

const appStore = (
  initStatus = {
    path: config.startPath,
    files: [],
    users: [],
    isErrorApp: false,
    isAdmin: false,
    fileText: '',
  },
  action
) => {
  switch (action.type) {
    case 'SET_PATH_APP': {
      return Object.assign({}, initStatus, {
        path: action.path,
        files: action.files,
      });
    }
    case 'SET_FILES_APP': {
      return Object.assign({}, initStatus, { files: action.files });
    }
    case 'UPDATE_FILES_APP': {
      let newStore = Object.assign({}, initStatus);
      if (action.data.updateType === 'deleted') {
        const files = newStore.files.filter(el => el.name !== action.data.name);
        return Object.assign({}, initStatus, { files: files });
      } else if (action.data.updateType === 'added') {
        newStore.files.push(action.data.file);
        newStore.files.sort((a, b) => b.name.localeCompare(a.name));
        return Object.assign({}, initStatus, { files: newStore.files });
      }
      break;
    }
    case 'SET_FILES_TEXT_APP': {
      return Object.assign({}, initStatus, { fileText: action.fileText });
    }
    case 'SET_IS_ERROR_APP': {
      return Object.assign({}, initStatus, { isErrorApp: action.isErrorApp });
    }
    case 'SET_USERS_APP': {
      return Object.assign({}, initStatus, { users: action.users });
    }
    case 'SET_IS_ADMIN': {
      return Object.assign({}, initStatus, { isAdmin: action.isAdmin });
    }
    case 'UPDATE_DETAILS_SUCCESS_ITEM': {
      let newStore = Object.assign({}, initStatus);
      let item = newStore.files.find(el => el.fileId === action.fileId);
      item.size = action.size;
      item.type = action.fileType;
      item.date = action.date;
      item.isLoaded = action.isLoaded;
      return newStore;
    }
    case 'UPDATE_DETAILS_ERROR_ITEM': {
      let newStore = Object.assign({}, initStatus);
      let elem = newStore.files.find(el => el.fileId === action.fileId);
      elem.isError = true;
      elem.isLoaded = action.isLoaded;
      return newStore;
    }
    default:
      return initStatus;
  }
};
export default appStore;
