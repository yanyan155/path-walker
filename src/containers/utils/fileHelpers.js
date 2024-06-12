import { v4 as uuidv4 } from 'uuid';
import { transformFilesArr } from './socketHelpers';
import config from '../../../config';

export function findPathUI(pathNode, path) {
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

export function itemWrapperClick(
  event,
  findPathUI,
  receiveFiles,
  setPath,
  setIsAdmin,
  setFiles,
  setFilesText,
  setIsError,
  pathX
) {
  let elem = event.target;
  if (!elem.classlist?.contains('item-wrapper')) {
    elem = elem.closest('.item-wrapper');
  }
  const path = findPathUI(elem.dataset.path, pathX);
  const typeSpan = elem.querySelector('.file-type');
  const type = typeSpan?.innerHTML ?? '';
  receiveFiles(
    path,
    type,
    uuidv4,
    setPath,
    setIsAdmin,
    setFiles,
    setPath,
    setFilesText,
    setIsError
  );
}

export function setSortEvent(event, setSortFiles, sortType) {
  const elem = event.target;
  setSortFiles(sortType, elem.dataset.sorttype);
}

export function setFilterEvent(event, setFilterFiles) {
  const elem = event.target;
  setFilterFiles(elem.value);
}

export async function receiveFiles(
  path,
  type,
  uuidv4,
  setPath,
  setIsAdmin,
  setFiles,
  setFilesText,
  setIsError
) {
  try {
    const json = await fetch(
      `${config.appUrl}search?q=${encodeURIComponent(path)}&type=${type}`
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
