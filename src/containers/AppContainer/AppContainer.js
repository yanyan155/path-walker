import React, { useEffect } from 'react';

import Files from '../Files/Files';
import AdminBar from '../AdminBar/AdminBar';
import { connect } from 'react-redux';
import { setUsersApp, updateFilesApp } from '../../actions';
import PropTypes from 'prop-types';
import { createSocket, transformFilesArr } from '../utils/socketHelpers';
import { getName } from '../utils/localStorageHelper';
import Typography from '../common/Typography/Typography';
import LogOutForm from './components/LogOutForm/LogOutForm';
import Button from '../common/Button/Button';
import './style.css';

function AppContainer({
  path,
  isErrorApp,
  isAdmin,
  fileText,
  setUsers,
  updateFiles,
}) {
  const errorMessage = 'Something went wrong! Please try again later.';

  useEffect(() => {
    createSocket(setUsers, updateFiles, transformFilesArr, path);
  }, [setUsers, updateFiles, transformFilesArr, path]);

  const logOutForm = React.createRef();

  function logoutClick() {
    logOutForm.current.submit();
  }

  return (
    <div>
      <Typography tag="h3" className="mt-3">
        welcome, {getName()}!
      </Typography>
      <div className="d-flex">
        <Typography tag="span">Your path is:</Typography>&emsp;
        <Typography tag="strong">{path}</Typography>
        <Button
          onClick={logoutClick}
          type="button"
          text="Logout"
          extraClasses="ml-auto"
        />
        <LogOutForm logOutFormRef={logOutForm}></LogOutForm>
      </div>
      {fileText || isErrorApp ? (
        <Typography tag="p">{fileText || errorMessage}</Typography>
      ) : (
        <Files />
      )}
      {isAdmin && <AdminBar />}
    </div>
  );
}

AppContainer.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
