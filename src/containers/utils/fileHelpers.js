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
  // TODO: set ref here instead of DOM calculations
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

export function sortFiles(files, sortType) {
  switch (sortType) {
    case 'NAME':
      return files.sort((a, b) => b.name.localeCompare(a.name));
    case 'NAME_REVERT':
      return files.sort((a, b) => a.name.localeCompare(b.name));
    case 'DIRECTORY':
      return files.sort((a, b) => b.type.localeCompare(a.type));
    case 'DIRECTORY_REVERT':
      return files.sort((a, b) => a.type.localeCompare(b.type));
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

export function filterFiles(files, filter) {
  return files.filter(el => el.name.includes(filter));
}
