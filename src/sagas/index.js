import { put, call, fork, select } from 'redux-saga/effects'
import actionTypes from '../constants'
import startupSaga from './startup'
import userSaga from './user'
import appsSaga from './apps'
import combinationRiskManagerSaga from 'containersV2/CombiRiskManager/sagas'

// main saga generators
export function* sagas() {
  yield fork(startupSaga)
  yield fork(userSaga)
  yield fork(appsSaga)
  yield fork(combinationRiskManagerSaga)
}
