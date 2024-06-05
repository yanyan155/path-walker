import React from 'react';
import { render } from 'react-dom';
import Files from './Files.js';
import AdminBar from './AdminBar.js';
import { connect, Provider } from 'react-redux';
import { setUsersApp, updateFilesApp } from '../actions';
import PropTypes from 'prop-types';
const redux = require('redux');
import rootReducer from '../reducers';
import { useDidMount } from 'beautiful-react-hooks';
import { v4 as uuidv4 } from 'uuid';

const store = redux.createStore(rootReducer);

function App({ path, isErrorApp, isAdmin, fileText, setUsers, updateFiles }) {
  const errorMessage = 'Something went wrong! Please try again later.';

  // todo make replace divs with table
  // todo will key={uuidv4()} each time updates on rerendiring page --- think about caching strategy??

  useDidMount(() => {
    createSocket();
  });

  const logOutForm = React.createRef();

  function logoutClick() {
    logOutForm.current.submit();
  }

  function transformFilesArr(files, newPath, uuidv4) {
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

  function createSocket() {
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
        createSocket();
      }, 3000);
    }
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
      {fileText || isErrorApp ? (
        <p>{fileText || errorMessage}</p>
      ) : (
        <Files transformFilesArr={transformFilesArr} />
      )}
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
