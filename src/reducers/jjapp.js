import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import jjAppReducer from './jjAppReducer'

//Combination Risk Manager
import combinationRiskManager from 'containersV2/CombiRiskManager/reducers'

// main reducers
export const reducers = combineReducers({
	jjAppReducer,
})
