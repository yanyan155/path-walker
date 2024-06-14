import React, { useEffect } from 'react';
import config from '../../../config';
import {
  updateDetailsSuccessItem,
  updateDetailsErrorItem,
  setPathApp,
  setFilesApp,
  setFilesTextApp,
  setIsErrorApp,
  setIsAdminApp,
} from '../../actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  findPathUI,
  itemWrapperClick,
  receiveFiles,
} from '../utils/fileHelpers';
import { deleteFileAjax, getDetails } from '../utils/listComponentHelpers';

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
      fileId,
      updateDetailsSuccess,
      updateDetailsError
    );
  }, [getDetails, absolutePath, updateDetailsSuccess, updateDetailsError]);

  function removeClick(event, deleteFileAjax, type) {
    event.stopPropagation();
    deleteFileAjax(absolutePath, type === 'directory');
  }

  const dateFormatted = date ? new Date(date).toString().slice(0, 24) : '';
  const errorMessage = 'You have no rights to access this file!';

  return (
    <tr
      className="item-wrapper"
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
      <th scope="row" className="item-name">
        {name}
      </th>
      {isLoaded && isError && <td>{errorMessage}</td>}
      {isLoaded && !isError && <td>{size}</td>}
      {isLoaded && !isError && <td>{type}</td>}
      {isLoaded && !isError && <td>{dateFormatted}</td>}
      {isLoaded && !isError && isAdmin && path !== '/' && (
        <td>
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            className="bi bi-trash"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            onClick={e => removeClick(e, deleteFileAjax, type)}
          >
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
            <path
              fillRule="evenodd"
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
            />
          </svg>
        </td>
      )}
    </tr>
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
