import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setUsersApp } from '../actions';
import PropTypes from 'prop-types';
import {
  findNewUsers,
  addFileClick,
  createFileAjax,
  receiveUsers,
  updateRolesSubmit,
  updateRolesAjax,
  findUpdatedUsers,
} from './utils/adminHelpers';

function AdminBar({ path, users, isAdmin, setUsers }) {
  useEffect(async () => {
    if (isAdmin) {
      await receiveUsers(setUsers);
    }
  }, [isAdmin, setUsers, receiveUsers]);

  const fileNameRef = React.createRef();
  const fileTextRef = React.createRef();
  const isDirCheckboxRef = React.createRef();

  return (
    <div className="mt-4">
      <p>admin bar</p>
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
        action="/createFile"
        method="post"
      >
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
              findNewUsers,
              updateRolesAjax
            )
          }
          action="/updateRoles"
          method="post"
        >
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
