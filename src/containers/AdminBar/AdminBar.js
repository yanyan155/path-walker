import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { setUsersApp } from '../../actions';
import PropTypes from 'prop-types';
import {
  addFileClick,
  createFileAjax,
  receiveUsers,
  updateRolesSubmit,
  updateRolesAjax,
  findUpdatedUsers,
} from '../utils/adminHelpers';

function AdminBar({ path, users, isAdmin, setUsers }) {
  useEffect(async () => {
    if (isAdmin) {
      await receiveUsers(setUsers);
    }
  }, [isAdmin, setUsers, receiveUsers]);

  const [localUsers, setLocalUsers] = useState(users);
  useEffect(() => {
    setLocalUsers(users);
  }, [users, setLocalUsers]);

  const fileNameRef = React.createRef();
  const fileTextRef = React.createRef();
  const isDirCheckboxRef = React.createRef();

  function localUpdateRoles(index, setLocalUsers) {
    setLocalUsers(state => {
      const newUser = {
        name: state[index].name,
        isAdmin: !state[index].isAdmin,
      };

      return [...state.slice(0, index), newUser, ...state.slice(index + 1)];
    });
  }

  return (
    <div className="mt-4">
      <h2>Admin bar</h2>
      <form
        onSubmit={e =>
          addFileClick(
            e,
            path,
            fileNameRef,
            fileTextRef,
            isDirCheckboxRef,
            createFileAjax
          )
        }
        className="border  mt-3 mb-3 p-3"
        action="/createFile"
        method="post"
      >
        <h3>create new file / directory</h3>
        <div className="form-group">
          <label htmlFor="fileName">file name</label>
          <input
            id="fileName"
            name="fileName"
            type="text"
            placeholder="fileName"
            minLength="1"
            className="form-control"
            ref={fileNameRef}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fileText">file text</label>
          <textarea
            placeholder="put file's text here"
            className="form-control"
            id="fileText"
            rows="3"
            ref={fileTextRef}
          />
        </div>
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="isDirectoryCheckbox"
            ref={isDirCheckboxRef}
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
        <form
          onSubmit={e =>
            updateRolesSubmit(
              e,
              findUpdatedUsers,
              users,
              localUsers,
              updateRolesAjax
            )
          }
          className="border mt-3 mb-3 p-3"
          action="/updateRoles"
          method="post"
        >
          <h3>Update roles</h3>
          <p>check checkbox to set Admin role to the user</p>
          {localUsers.map((el, i) => {
            const id = `user-${i}`;
            return (
              <div key={i} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={id}
                  defaultChecked={el.isAdmin}
                  onClick={() => localUpdateRoles(i, setLocalUsers)}
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
