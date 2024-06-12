import React, { useEffect } from 'react';
import { render } from 'react-dom';
import Files from './Files.js';
import AdminBar from './AdminBar.js';
import { connect, Provider } from 'react-redux';
import { setUsersApp, updateFilesApp } from '../actions';
import PropTypes from 'prop-types';
const redux = require('redux');
import rootReducer from '../reducers';
import { createSocket, transformFilesArr } from './utils/socketHelpers';

const store = redux.createStore(rootReducer);

function App({ path, isErrorApp, isAdmin, fileText, setUsers, updateFiles }) {
  const errorMessage = 'Something went wrong! Please try again later.';

  // todo make replace divs with table
  // todo will key={uuidv4()} each time updates on rerendiring page --- think about caching strategy??

  useEffect(() => {
    createSocket(setUsers, updateFiles, transformFilesArr, path);
  }, [setUsers, updateFiles, transformFilesArr, path]);

  const logOutForm = React.createRef();

  function logoutClick() {
    logOutForm.current.submit();
  }

  return (
    <div>
      <div className="d-flex">
        <span>Your path is:</span>&emsp;
        <strong>{path}</strong>
        <button
          onClick={logoutClick}
          type="button"
          className="btn btn-primary ml-auto"
        >
          Logout
        </button>
        <form
          id="logout-form"
          action="/logout"
          method="post"
          className="opacity-0"
          ref={logOutForm}
        ></form>
      </div>
      {fileText || isErrorApp ? <p>{fileText || errorMessage}</p> : <Files />}
      {isAdmin && <AdminBar />}
    </div>
  );
}

App.propTypes = {
  path: PropTypes.string.isRequired,
  isErrorApp: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  fileText: PropTypes.string.isRequired,
};

const mapStateToProps = ({ appStore }) => ({
  path: appStore.path,
  files: appStore.files,
  isErrorApp: appStore.isErrorApp,
  isAdmin: appStore.isAdmin,
  fileText: appStore.fileText,
});

const mapDispatchToProps = dispatch => ({
  setUsers: users => dispatch(setUsersApp(users)),
  updateFiles: data => dispatch(updateFilesApp(data)),
});

const AppEl = connect(mapStateToProps, mapDispatchToProps)(App);

render(
  <Provider store={store}>
    <AppEl />
  </Provider>,
  document.getElementById('root')
);
