import React from 'react';
import { connect } from 'react-redux';
import { useDidMount } from 'beautiful-react-hooks';
import { setUsersApp } from '../actions';
import PropTypes from 'prop-types';

function AdminBar({ path, users, isAdmin, setUsers }) {
  useDidMount(async () => {
    if (isAdmin) {
      await receiveUsers();
    }
  });

  function addFileClick(event) {
    event.preventDefault();
    const nameInput = document.getElementById('fileName');
    const textInput = document.getElementById('fileText');
    const isDirCheckbox = document.getElementById('isDirectoryCheckbox');
    const data = {
      isDirectory: isDirCheckbox.checked,
      text: textInput.value,
      path: `${path}/${nameInput.value}`,
    };
    createFileAjax(data);
  }

  async function createFileAjax(data) {
    const response = await fetch('/createFile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      alert('file successfully added');
      const fileName = document.getElementById('fileName');
      fileName.value = '';
      const fileText = document.getElementById('fileText');
      fileText.value = '';
      const directoryCheckbox = document.getElementById('isDirectoryCheckbox');
      directoryCheckbox.checked = false;
    } else {
      let error = await response.json();
      alert(error);
    }
  }

  async function receiveUsers() {
    const response = await fetch('/receiveUsers');
    const result = await response.json();
    if (response.status === 200) {
      setUsers(result);
    } else {
      alert('some error occurs');
    }
  }

  function updateRolesSubmit(event) {
    event.preventDefault();
    const updatedUsers = findUpdatedUsers(users, findNewUsers());
    if (updatedUsers.length > 0) {
      const data = {
        users: JSON.stringify(updatedUsers),
      };
      updateRolesAjax(data);
    }
  }

  async function updateRolesAjax(data) {
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

  return (
    <div className="mt-4">
      <p>admin bar</p>
      <form onSubmit={addFileClick} action="/createFile" method="post">
        <p>create new file / directory</p>
        <div className="form-group">
          <label htmlFor="fileName">file name</label>
          <input
            id="fileName"
            name="fileName"
            type="text"
            placeholder="fileName"
            minLength="1"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="fileText">file text</label>
          <textarea
            placeholder="put file's text here"
            className="form-control"
            id="fileText"
            rows="3"
          />
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isDirectoryCheckbox"
          />
          <label className="form-check-label" htmlFor="isDirectoryCheckbox">
            isDirectory
          </label>
        </div>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </form>
      {users.length > 0 && (
        <form onSubmit={updateRolesSubmit} action="/updateRoles" method="post">
          <p>update roles</p>
          {users.map((el, i) => {
            const id = `user-${i}`;
            return (
              <div key={i} className="form-check">
                <input
                  data-name={el.name}
                  type="checkbox"
                  className="form-check-input"
                  id={id}
                  defaultChecked={el.isAdmin}
                />
                <label className="form-check-label" htmlFor={id}>
                  {el.name}
                </label>
              </div>
            );
          })}

          <button type="submit" className="btn btn-primary">
            update roles
          </button>
        </form>
      )}
    </div>
  );
}

AdminBar.propTypes = {
  path: PropTypes.string.isRequired,
  users: PropTypes.array.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  setUsers: PropTypes.func.isRequired,
};

const mapStateToProps = ({ appStore }) => ({
  users: appStore.users,
  isAdmin: appStore.isAdmin,
  path: appStore.path,
});

const mapDispatchToProps = dispatch => ({
  setUsers: users => dispatch(setUsersApp(users)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminBar);

function findUpdatedUsers(users, newUsers) {
  return newUsers.filter(el => {
    const oldUser = users.find(elem => elem.name === el.name);
    return !(oldUser.isAdmin === el.isAdmin);
  });
}

function findNewUsers() {
  const inputs = document.querySelectorAll('[id^="user"]');
  const inputsArr = Array.from(inputs);
  return inputsArr.map(el => {
    return {
      name: el.dataset.name,
      isAdmin: el.checked,
    };
  });
}
