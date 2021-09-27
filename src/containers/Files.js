import React from 'react';
import ListComponent from './ListComponent';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import LazyLoad from 'react-lazyload';
import { useDidMount } from 'beautiful-react-hooks';
import PropTypes from 'prop-types';

import {
  setPathApp,
  setFilesApp,
  setFilesTextApp,
  setIsErrorApp,
  setIsAdminApp,
  setFilterFiles,
  setSortFiles,
} from '../actions';
import config from '../../config';

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
  transformFilesArr,
}) {
  useDidMount(() => {
    if (path !== '/') {
      receiveFiles(path, '', uuidv4);
    }
  });

  function findPath(pathNode) {
    if (pathNode === '..') {
      const index = path.lastIndexOf('/');
      if (path[index - 1] === ':' && index !== path.length - 1) {
        return path.slice(0, index + 1);
      } else if (path[index - 1] === ':' && index === path.length - 1) {
        return '/';
      }
      return path.slice(0, index);
    } else if (path === '/') {
      return pathNode;
    } else if (path.length === 3) {
      return path.concat(pathNode);
    }
    return path.concat(`/${pathNode}`);
  }

  function itemWrapperClick(event) {
    let elem = event.target;
    if (!elem.classlist?.contains('item-wrapper')) {
      elem = elem.closest('.item-wrapper');
    }
    const path = findPath(elem.dataset.path);
    const typeSpan = elem.querySelector('.file-type');
    const type = typeSpan?.innerHTML ?? '';
    receiveFiles(path, type, uuidv4);
  }

  function setSortEvent(event) {
    const elem = event.target;
    setSortFiles(sortType, elem.dataset.sorttype);
  }

  function setFilterEvent(event) {
    const elem = event.target;
    setFilterFiles(elem.value);
  }

  async function receiveFiles(path, type, uuidv4) {
    try {
      const json = await fetch(
        `${config.searchUrl}search?q=${encodeURIComponent(path)}&type=${type}`
      );
      const data = await json.json();
      if (data.files) {
        setPath(data.path);
        setIsAdmin(data.isAdmin);
        setFiles(transformFilesArr(data.files, data.path, uuidv4));
      } else if (data.fileText) {
        setPath(data.path);
        setFilesText(data.fileText);
      }
    } catch (err) {
      setIsError(true);
    }
  }

  return (
    <div>
      <div className="form-group">
        <label htmlFor="search">search</label>
        <input
          onChange={setFilterEvent}
          id="search"
          name="search"
          type="text"
          placeholder="search"
          className="form-control"
        />
      </div>
      <div className="row">
        <div onClick={setSortEvent} data-sorttype="NAME" className="col-2">
          Name
        </div>
        <div className="row col-10">
          <div onClick={setSortEvent} data-sorttype="SIZE" className="col-2">
            Size, bites
          </div>
          <div
            onClick={setSortEvent}
            data-sorttype="DIRECTORY"
            className="col-2"
          >
            Type
          </div>
          <div onClick={setSortEvent} data-sorttype="DATE" className="col-8">
            Last modified date
          </div>
        </div>
      </div>
      {path !== '/' && (
        <LazyLoad key={uuidv4()}>
          <div
            onClick={itemWrapperClick}
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
            <ListComponent itemWrapperClick={itemWrapperClick} item={el} />
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
  transformFilesArr: PropTypes.func.isRequired,
};

const mapStateToProps = ({ appStore, listView }, { transformFilesArr }) => ({
  files: filterFiles(
    sortFiles(appStore.files, listView.sortType),
    listView.filterValue
  ),
  path: appStore.path,
  sortType: listView.sortType,
  transformFilesArr,
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
