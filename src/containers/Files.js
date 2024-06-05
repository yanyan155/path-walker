import React from 'react';
import ListComponent from './ListComponent';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import { useDidMount } from 'beautiful-react-hooks';
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
}) {
  useDidMount(() => {
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
  });

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
      <div className="row">
        <div
          onClick={event => setSortEvent(event, setSortFiles, sortType)}
          data-sorttype="NAME"
          className="col-2"
        >
          Name
        </div>
        <div className="row col-10">
          <div
            onClick={event => setSortEvent(event, setSortFiles, sortType)}
            data-sorttype="SIZE"
            className="col-2"
          >
            Size, bites
          </div>
          <div
            onClick={event => setSortEvent(event, setSortFiles, sortType)}
            data-sorttype="DIRECTORY"
            className="col-2"
          >
            Type
          </div>
          <div
            onClick={event => setSortEvent(event, setSortFiles, sortType)}
            data-sorttype="DATE"
            className="col-8"
          >
            Last modified date
          </div>
        </div>
      </div>
      {path !== '/' && (
        <LazyLoad key={uuidv4()}>
          <div
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
            className="item-wrapper row"
            key={uuidv4()}
            data-path=".."
          >
            <span className="col-2 item-name">/.. </span>
          </div>
        </LazyLoad>
      )}
      {files.map(el => {
        return (
          <LazyLoad key={el.lazyLoadId}>
            <ListComponent item={el} />
          </LazyLoad>
        );
      })}
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
};

const mapStateToProps = ({ appStore, listView }) => ({
  files: filterFiles(
    sortFiles(appStore.files, listView.sortType),
    listView.filterValue
  ),
  path: appStore.path,
  sortType: listView.sortType,
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
