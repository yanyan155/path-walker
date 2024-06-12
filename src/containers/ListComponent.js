import React, { useEffect } from 'react';
import config from '../../config';
import {
  updateDetailsSuccessItem,
  updateDetailsErrorItem,
  setPathApp,
  setFilesApp,
  setFilesTextApp,
  setIsErrorApp,
  setIsAdminApp,
} from '../actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  findPathUI,
  itemWrapperClick,
  receiveFiles,
} from './utils/fileHelpers';

function ListComponentEl({
  isAdmin,
  absolutePath,
  name,
  size,
  type,
  date,
  isError,
  updateDetailsSuccess,
  updateDetailsError,
  isLoaded,
  fileId,
  path,
  setPath,
  setIsAdmin,
  setFiles,
  setFilesText,
  setIsError,
}) {
  useEffect(() => {
    getDetails(
      `${config.appUrl}stats?q=${encodeURIComponent(absolutePath)}`,
      fileId
    );
  }, [getDetails, absolutePath]);

  async function getDetails(path, fileId) {
    try {
      const json = await fetch(path);
      const data = await json.json();
      updateDetailsSuccess(fileId, data.size, data.type, data.modifiedDate);
    } catch (err) {
      updateDetailsError(fileId);
    }
  }

  function removeClick(event) {
    event.stopPropagation();
    deleteFileAjax(absolutePath, type === 'directory');
  }

  async function deleteFileAjax(path, isDirectory) {
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

  const dateFormatted = date ? new Date(date).toString().slice(0, 24) : '';
  const errorMessage = 'You have no rights to access this file!';
  // todo repace keys so they will not update on rerender component
  return (
    <div
      className="item-wrapper row"
      key={fileId}
      data-path={name}
      onClick={event =>
        itemWrapperClick(
          event,
          findPathUI,
          receiveFiles,
          setPath,
          setIsAdmin,
          setFiles,
          setFilesText,
          setIsError,
          path
        )
      }
    >
      <span className="col-2 item-name">{name}</span>
      {isLoaded && isError && <span>{errorMessage}</span>}
      {isLoaded && !isError && (
        <span className="row col-10">
          <span className="col-2">{size}</span>
          <span className="col-2 file-type">{type}</span>
          <span className="col-6">{dateFormatted}</span>
          {isAdmin && path !== '/' && (
            <span className="col-2">
              <svg
                width="1em"
                height="1em"
                viewBox="0 0 16 16"
                className="bi bi-trash"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                onClick={removeClick}
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                <path
                  fillRule="evenodd"
                  d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                />
              </svg>
            </span>
          )}
        </span>
      )}
    </div>
  );
}

ListComponentEl.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  absolutePath: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
  isError: PropTypes.bool.isRequired,
  updateDetailsSuccess: PropTypes.func.isRequired,
  updateDetailsError: PropTypes.func.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  fileId: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

const mapStateToProps = ({ appStore }, { item }) => ({
  path: appStore.path,
  absolutePath: item.absolutePath,
  name: item.name,
  size: item.size,
  type: item.type,
  isLoaded: item.isLoaded,
  date: item.date,
  isError: item.isError,
  isAdmin: appStore.isAdmin,
  fileId: item.fileId,
});

const mapDispatchToProps = dispatch => ({
  updateDetailsSuccess: (fileId, size, isDirectory, date) =>
    dispatch(updateDetailsSuccessItem(fileId, size, isDirectory, date)),
  updateDetailsError: fileId => dispatch(updateDetailsErrorItem(fileId)),
  setPath: path => dispatch(setPathApp(path)),
  setFiles: files => dispatch(setFilesApp(files)),
  setFilesText: fileText => dispatch(setFilesTextApp(fileText)),
  setIsError: isErrorApp => dispatch(setIsErrorApp(isErrorApp)),
  setIsAdmin: idAdmin => dispatch(setIsAdminApp(idAdmin)),
});

const ListComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListComponentEl);

export default ListComponent;
