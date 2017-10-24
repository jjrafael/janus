import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import apiConstants from './apiConstants'
import user from './user'
import apps from './apps'
import modals from './modals'
import startup from './startup'

//Combination Risk Manager
import combinationRiskManager from 'containersV2/CombiRiskManager/reducers'

// main reducers
export const reducers = combineReducers({
  routing: routerReducer,
  form: formReducer,
  apiConstants,
  user,
  apps,
  modals,
  startup,
  combinationRiskManager,
})
