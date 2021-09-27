import { combineReducers } from 'redux'
import listView from './listView'
import appStore from './appStore'

export default combineReducers({
  listView,
  appStore
})