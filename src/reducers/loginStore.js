const loginStore = (initStatus = { status: '', responseText: '' }, action) => {
  switch (action.type) {
    case 'SET_LOGIN_ERROR':
      return { status: action.status, responseText: action.responseText };
    default:
      return initStatus;
  }
};

export default loginStore;
