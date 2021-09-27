const listView = (
  state = {
    filterValue: '',
    sortType: '',
  },
  action
) => {
  switch (action.type) {
    case 'SET_SORT_TYPE':
      return Object.assign({}, state, { sortType: action.sortType });
    case 'SET_FILTER':
      return Object.assign({}, state, { filterValue: action.filterValue });
    default:
      return state;
  }
};

export default listView;
