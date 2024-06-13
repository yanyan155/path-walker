import React, { useEffect } from 'react';
import ListComponent from './ListComponent';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
// import LazyLoad from 'react-lazyload';
// remove react-lazyload npm package
import PropTypes from 'prop-types';

import {
  findPathUI,
  itemWrapperClick,
  setSortEvent,
  setFilterEvent,
  receiveFiles,
} from './utils/fileHelpers';

import {
  setPathApp,
  setFilesApp,
  setFilesTextApp,
  setIsErrorApp,
  setIsAdminApp,
  setFilterFiles,
  setSortFiles,
} from '../actions';

function Files({
  path,
  files,
  setPath,
  setFiles,
  setFilesText,
  setIsError,
  setIsAdmin,
  sortType,
  setFilterFiles,
  setSortFiles,
  isAdmin,
}) {
  useEffect(() => {
    if (path !== '/') {
      receiveFiles(
        path,
        '',
        uuidv4,
        setPath,
        setIsAdmin,
        setFiles,
        setFilesText,
        setIsError
      );
    }
  }, [path, uuidv4, setPath, setIsAdmin, setFiles, setFilesText, setIsError]);

  return (
    <div>
      <div className="form-group">
        <label htmlFor="search">search</label>
        <input
          onChange={event => setFilterEvent(event, setFilterFiles)}
          id="search"
          name="search"
          type="text"
          placeholder="search"
          className="form-control"
        />
      </div>
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th
              onClick={event => setSortEvent(event, setSortFiles, sortType)}
              data-sorttype="NAME"
              className="col-3"
              scope="col"
            >
              Name or path
            </th>
            <th
              onClick={event => setSortEvent(event, setSortFiles, sortType)}
              data-sorttype="SIZE"
              scope="col"
              className="col-2"
            >
              Size, bites
            </th>
            <th
              onClick={event => setSortEvent(event, setSortFiles, sortType)}
              data-sorttype="DIRECTORY"
              scope="col"
              className="col-2"
            >
              Type
            </th>
            <th
              onClick={event => setSortEvent(event, setSortFiles, sortType)}
              data-sorttype="DATE"
              scope="col"
              className="col-4"
            >
              Last modified date
            </th>
            {isAdmin && (
              <th className="col-1" scope="col">
                Delete
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {path !== '/' && (
            <tr>
              <th
                scope="row"
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
                className="item-wrapper"
                key={uuidv4()}
                data-path=".."
              >
                <span className="item-name">/.. (go to the parent folder)</span>
              </th>
            </tr>
          )}
          {files.map(el => {
            return <ListComponent item={el} />;
          })}
        </tbody>
      </table>
    </div>
  );
}

Files.propTypes = {
  path: PropTypes.string.isRequired,
  files: PropTypes.array.isRequired,
  setPath: PropTypes.func.isRequired,
  setFiles: PropTypes.func.isRequired,
  setFilesText: PropTypes.func.isRequired,
  setIsError: PropTypes.func.isRequired,
  sortType: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ appStore, listView }) => ({
  files: filterFiles(
    sortFiles(appStore.files, listView.sortType),
    listView.filterValue
  ),
  path: appStore.path,
  sortType: listView.sortType,
  isAdmin: appStore.isAdmin,
});

const mapDispatchToProps = dispatch => ({
  setPath: path => dispatch(setPathApp(path)),
  setFiles: files => dispatch(setFilesApp(files)),
  setFilesText: fileText => dispatch(setFilesTextApp(fileText)),
  setIsError: isErrorApp => dispatch(setIsErrorApp(isErrorApp)),
  setIsAdmin: idAdmin => dispatch(setIsAdminApp(idAdmin)),
  setSortFiles: (prev, current) => dispatch(setSortFiles(prev, current)),
  setFilterFiles: filterValue => dispatch(setFilterFiles(filterValue)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Files);

function sortFiles(files, sortType) {
  switch (sortType) {
    case 'NAME':
      return files.sort((a, b) => b.name.localeCompare(a.name));
    case 'NAME_REVERT':
      return files.sort((a, b) => a.name.localeCompare(b.name));
    case 'DIRECTORY':
      return files.sort((a, b) => a.isDirectory - b.isDirectory);
    case 'DIRECTORY_REVERT':
      return files.sort((a, b) => b.isDirectory - a.isDirectory);
    case 'SIZE':
      return files.sort((a, b) => a.size - b.size);
    case 'SIZE_REVERT':
      return files.sort((a, b) => b.size - a.size);
    case 'DATE':
      return files.sort((a, b) => a.date - b.date);
    case 'DATE_REVERT':
      return files.sort((a, b) => b.date - a.date);
    default:
      return files;
  }
}

function filterFiles(files, filter) {
  return files.filter(el => el.name.includes(filter));
}
